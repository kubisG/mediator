import { Component, OnInit, OnDestroy, ComponentFactoryResolver, Injector, ApplicationRef, Inject } from "@angular/core";
import { Store } from "@ngxs/store";

import { MatDialog } from "@angular/material";
import { SplitStoreService } from "../split-store.service";

import { Subscription } from "rxjs/internal/Subscription";
import { NotifyService } from "../../core/notify/notify.service";
import { RestPreferencesService } from "../../rest/rest-preferences.service";
import { MessageType } from "@ra/web-shared-fe";
import { AuthState } from "../../core/authentication/state/auth.state";
import { TranslateService } from "@ngx-translate/core";
import { MoneyService } from "../../core/money/money.service";
import { OrdStatus } from "@ra/web-shared-fe";
import { ActionItem } from "@ra/web-shared-fe";
import { DropDownItem } from "@ra/web-shared-fe";
import { OrderGridComponent } from "../../orders/order-grid/order-grid.component";
import { MessageFactoryService } from "../../orders/message-factory.service";
import { Apps } from "../../core/apps.enum";
import { OrderDetailDialogComponent } from "../../orders/order-detail-dialog/order-detail-dialog.component";
import { OrderStatusService } from "../../orders/order-status.service";
import { ConfirmDialogComponent } from "@ra/web-shared-fe";
import { OrderDialogComponent } from "../../orders/order-dialog/order-dialog.component";
import { AppType } from "@ra/web-shared-fe";
import { DataExchangeService } from "@ra/web-components";
import { Dockable, DockableComponent, DockableHooks } from "@ra/web-components";
import { OrderInitService } from "../../rest/order-init.service";
import { environment } from "../../../environments/environment";

@Dockable({
    label: "Split Order",
    icon: "call_split",
    single: false
})
@Component({
    selector: "ra-split-store",
    templateUrl: "./order-store.component.html",
    styleUrls: ["./order-store.component.less"],
})
export class OrderSplitComponent extends DockableComponent implements OnInit, DockableHooks {

    set parentOrder(order) {
        this._parentOrder = order;
        this.orderStoreService.setParentOrder(order);
    }

    get parentOrder() {
        return this._parentOrder;
    }

    public _parentOrder;
    public inicialiazed = false;

    private allowedStatus = [OrdStatus.New, OrdStatus.PartiallyFilled, OrdStatus.Filled, OrdStatus.Replaced, OrdStatus.PendingNew];
    public rowColors = {};
    private translations = {};
    private orderSub: Subscription;
    private ordersSub: Subscription;
    private executionSub: Subscription;
    private transSub: Subscription;
    public dataLoaded = false;

    public rowClick: {};
    public storeRowClick: {};
    public lists = {};
    public accounts = [];
    public prefs = { currency: { name: "" } };
    public allPrefs;
    public raId;

    public dateFilter = false;
    public _showMeOnly = false;
    private userId: number = null;
    public orderColumns = [];

    public balance = { allBalance: 0, allOpenBalance: 0 };
    public showImportComponent: boolean;

    public orderGrid: OrderGridComponent;

    public actionItems: ActionItem[] = [];
    public gridMenuItems: DropDownItem[] = [
        { toolTip: "butt.save.layout", icon: "send", label: "Save layout" },
        { toolTip: "butt.user.reload", icon: "replay", label: "Reload orders" },
    ];

    public rowActions = [
        {
            label: "Detail",
            icon: "visibility",
            visible: (data) => {
                return true;
            }
        },
        {
            label: "Replace",
            icon: "swap",
            visible: (data) => {
                return (this.allPrefs.role !== "READER") && this.allowedStatus.indexOf(data.data["OrdStatus"]) > -1;
            }
        },
        {
            label: "Cancel",
            icon: "clear",
            visible: (data) => {
                return (this.allPrefs.role !== "READER") && this.allowedStatus.indexOf(data.data["OrdStatus"]) > -1;
            }
        }
    ];

    constructor(
        private store: Store,
        private toasterService: NotifyService,
        public dialog: MatDialog,
        public orderStoreService: SplitStoreService,
        private restPreferencesService: RestPreferencesService,
        private translate: TranslateService,
        public moneyService: MoneyService,
        private messageFactoryService: MessageFactoryService,
        private orderStatusService: OrderStatusService,
        private orderInitService: OrderInitService,
        private dataExchangeService: DataExchangeService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
        this.allPrefs = this.store.selectSnapshot(AuthState.getUser);
        this.userId = this.allPrefs.userId;

    }

    public onGridInitialized(e) {

        this.orderGrid = e;
        this.initTableColumns();
        this.loadOrders(null, null);
    }

    private subscribeMessages() {
        this.ordersSub = this.orderStoreService.getRoutingMessageType(MessageType.Order).subscribe((order) => {
            if (this.parentOrder && order.ClOrdLinkID === this.parentOrder.RaID) {
                this.orderGrid.pushRow(order).then((pushType) => {
                    if (this.orderStoreService.showPopUp(order)) {
                        this.toasterService.pop(pushType.type, this.translations["new.message"], order.msgType + " "
                            + (order.Side ? order.Side : "") + " " + (order.Symbol ? order.Symbol : "")
                            + " " + (order.OrderQty ? order.OrderQty : "0") + (order.Price ? "@" + order.Price : ""), true
                            , "message_order", this.isShown);
                    }
                });
            }
        });
        this.executionSub = this.orderStoreService.getRoutingMessageType(MessageType.Execution).subscribe((execution) => {
            if (this.parentOrder && execution.ClOrdLinkID === this.parentOrder.RaID) {
                this.orderGrid.updateRow(execution);
                if (this.orderStoreService.showPopUp(execution)) {
                    this.toasterService.pop("info", this.translations["new.message"], execution.msgType + " " +
                        (execution.Side ? execution.Side : "") + " " + (execution.Symbol ? execution.Symbol : "")
                        + " " + (execution.LastQty ? execution.LastQty : "0") + "@" + (execution.LastPx ? execution.LastPx : "0"), true
                        , execution && (execution.OrdStatus === OrdStatus.PartiallyFilled || execution.OrdStatus === OrdStatus.Filled)
                            ? "message_fill" : null, this.isShown);
                }
            }
        });
    }

    public rowPushed(row) {
        if (row.type !== "insert") {
            return;
        }
        if (this.isShown) {
            setTimeout((instance) => {
                instance.orderGrid.refresh().then(() => {
                    // instance.onFillsClick(instance.orderGrid.lastInserted.RaID);
                }).catch((err) => {
                    // instance.onFillsClick(instance.orderGrid.lastInserted.RaID);
                });
            }, 0, this);
        }
    }

    private loadOrders(dateFrom: Date, dateTo: Date) {
        if (!this.inicialiazed || !this.parentOrder) {
            if (this.orderGrid) {
                this.orderGrid.clearData();
                this.orderGrid.endCustomLoading();
            }
            return;
        }

        if ((dateFrom) && (dateFrom !== null)) {
            this.dateFilter = true;
        } else {
            this.dateFilter = false;
        }
        this.dataLoaded = false;
        this.orderGrid.beginCustomLoading("Loading...");
        this.orderStoreService.loadStoredOrders(
            dateFrom, dateTo, !this._showMeOnly, Apps.trader, this.parentOrder.RaID).then((orders) => {
                if ((!orders) || (orders === null)) {
                    this.orderGrid.clearData();
                    this.orderGrid.endCustomLoading();
                } else {
                    this.orderGrid.setData(orders, false).then(() => {
                        if ((dateFrom) && (dateFrom !== null)) {
                            this.orderGrid.columnOption("TransactTime", "format", "y/MM/dd HH:mm:ss.S");
                            this.orderGrid.columnOption("Placed", "format", "y/MM/dd HH:mm:ss.S");
                        } else {
                            this.orderGrid.columnOption("TransactTime", "format", "HH:mm:ss.S");
                            this.orderGrid.columnOption("Placed", "format", "HH:mm:ss.S");
                        }
                        this.orderGrid.endCustomLoading();
                        this.dataLoaded = true;
                    });
                }
            }).catch((err) => {
                this.toasterService.pop("error", "Load orders", err.message);
            });
    }

    private initTableColumns() {
        this.orderGrid.loadState();
    }

    private setupColors() {
        this.restPreferencesService.getPreferences().then((prefs) => {
            this.prefs = prefs.pref;
            this.rowColors = prefs.pref ? prefs.pref.rowColors : {};
            this.setGridMenuItems(this._showMeOnly);
        });
    }

    private setActionItems(order?: any) {
        this.actionItems = [];
        if ((this.allPrefs.role !== "READER") && (this.orderStatusService.canSplit(this.parentOrder, false))) {
            this.actionItems.push({ toolTip: "New order", icon: "control_point", visible: true });
            if (order) {
                this.actionItems.push({ toolTip: "Cancel order", icon: "cancel", visible: true });
                this.actionItems.push({ toolTip: "Replace order", icon: "swap_horiz", visible: true });
            }
        }
    }

    private setGridMenuItems(showMeOnly = false) {
        this.gridMenuItems = [
            { toolTip: "butt.save.layout", icon: "send", label: "Save layout" },
            { toolTip: "butt.user.reload", icon: "replay", label: "Reload orders" },
        ];
    }

    private orderDetailDialog(e: any) {
        this.dataExchangeService.pushData({ order: e.data.data, lists: this.lists }, ["ORDER"]);
        const dialogRef = this.dialog.open(OrderDetailDialogComponent, {
            width: "95%",
            // height: "90%",
            data: {
                order: { ...e.data.data },
                lists: this.lists,
                orderStoreService: this.orderStoreService,
            }
        });
        dialogRef.afterClosed().subscribe((result) => {

        });
    }

    public actionItemClick(item: ActionItem) {
        switch (item.icon) {
            case "control_point": {
                this.openDialog({}, "N");
                break;
            }
            case "cancel": {
                this.openDialog(this.storeRowClick, "C");
                break;
            }
            case "swap_horiz": {
                this.openDialog(this.storeRowClick, "R");
                break;
            }
        }
    }

    public rowActionClick(e) {
        switch (e.action.label) {
            case "Detail": {
                this.orderDetailDialog(e);
                break;
            }
            case "Replace": {
                this.openDialog(e.data.data, "R");
                break;
            }
            case "Cancel": {
                this.openDialog(e.data.data, "C");
                break;
            }
            default: {
                break;
            }
        }
    }

    public gridMenuItemClick(item: DropDownItem) {
        switch (item.icon) {
            case "send": {
                this.saveState();
                break;
            }
            case "replay": {
                this.reloadDataGrid();
                break;
            }

        }
    }

    private confirmCancel(data: any) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: this.translations["really.cancel"] }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const message = this.messageFactoryService.cancelOrder({ ...data });
                this.orderStoreService.sendMessage(message);
            }
        });
    }

    /**
     * TODO : split method
     */
    openDialog(data: any, action?: string): void {
        if (action === "C") {
            this.confirmCancel(data);
        } else if (action === "R") {
            const dialogRef = this.dialog.open(OrderDialogComponent, {
                width: "40%",
                data: { data: data, action: "R" }
            });
            this.orderSub = dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    const message = this.messageFactoryService.replaceOrder(result);
                    this.orderStoreService.sendMessage(message);
                }
                this.orderSub.unsubscribe();
            });
        } else if (action === "N") {
            let newOrder = { ...this.parentOrder };
            const leavesQty = (newOrder.LeavesQty && newOrder.LeavesQty !== null) ? newOrder.LeavesQty : newOrder.OrderQty;
            newOrder = this.messageFactoryService.cleanOrder(newOrder);
            newOrder.ClOrdLinkID = this.parentOrder.RaID;
            const dialogRef = this.dialog.open(OrderDialogComponent, {
                width: "40%",
                data: { data: newOrder, LeavesQty: leavesQty, action: "N", appType: AppType.Broker }
            });
            this.orderSub = dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.parentOrder.splitted = "Y";
                    const message = this.messageFactoryService.newOrder(result);
                    this.orderStoreService.sendMessage(message);
                    this.dataExchangeService.pushData({ order: this.parentOrder }, ["SPLITTED"]);
                }
                this.orderSub.unsubscribe();
            });
        }
    }

    rowAcceptClick(event) {

    }

    rowRejectClick(event) {

    }

    rowCheck(event) {

    }

    getOrderColumns() {
        const that = this;
        return this.restPreferencesService.getAppPref("order_store_columns").then((columns) => {
            for (let i = 0; i < columns.length; i++) {
                columns[i].allowEditing = false;
                if ((columns[i].format) && (columns[i].format.precision)) {
                    columns[i].format.precision = environment.precision;
                }
                if (columns[i].lookup) {
                    columns[i].lookup = { "dataSource": this.lists[columns[i].dataField], "displayExpr": "name", "valueExpr": "value" };
                    columns[i].dataType = "lookup";
                }
                if (columns[i].lookup2) {
                    columns[i].lookup = { "dataSource": this.accounts, "displayExpr": "name", "valueExpr": "name" };
                    columns[i].dataType = "lookup";
                }
                if (columns[i].templateCell) {
                    columns[i].cellTemplate = columns[i].templateCell;
                    if (columns[i].templateCell === "graph") {
                        columns[i].allowSorting = true;
                        columns[i].calculateSortValue = function (data) {
                            let currentValue = 0;
                            if (data.OrderQty && data.OrderQty > 0) {
                                currentValue = (Number(data.CumQty ? data.CumQty : 0) / Number(data.OrderQty) * 100);
                            }
                            return currentValue;
                        };
                    }
                } else {
                    columns[i].calculateDisplayValue = function (data) {
                        return that.messageFactoryService.calculateDisplayValue(data, columns[i]);
                    };
                }
            }
            this.orderColumns = columns;
            return columns;
        });
    }

    /**
     * Data to orderstore has to be loaded at the end
     * First loaded InitLookup, than columns and than data
     * If this order is different, grid sometimes failed
     */
    ngOnInit() {

        this.transSub = this.translate.get(["really.cancel", "new.message"])
            .subscribe((res) => this.translations = res);
        this.subscribeMessages();
        this.setupColors();

        this.orderInitService.getRowColors().then((data) => {
            this.rowColors = data;
            this.orderInitService.getLists().then((adata) => {
                this.lists = adata;
                this.getOrderColumns().then((bdata) => {
                    this.inicialiazed = true;
                });
            });
        });

        const actData = this.dataExchangeService.getActData("SPLIT");
        if (actData.key && (actData.data) && (actData.data !== null)) {
            this.parentOrder = actData.data.order;
            this.setActionItems();
            if ((this.parentOrder) && (this.parentOrder !== null)) {
                if (this.parentOrder.splitted === "Y") {
                    if (this.orderGrid) {
                        this.loadOrders(null, null);
                    }
                } else {
                    if (this.orderGrid) {
                        this.orderGrid.clearData();
                        if (this.isShown) {
                            this.orderGrid.refresh();
                        }
                    }
                }
            } else {
                if (this.orderGrid) {
                    this.orderGrid.clearData();
                    if (this.isShown) {
                        this.orderGrid.refresh();
                    }
                }
            }


        }
        this.dataSub = this.dataExchangeService.getData().subscribe((data) => {
            if ((data.key.indexOf("SPLIT") > -1) && (this.isBind) && (data.data) && (data.data !== null)
                && (!this.parentOrder || (this.parentOrder !== data.data.order))) {
                this.parentOrder = data.data.order;
                this.setActionItems();

                if (this.parentOrder.splitted === "Y") {
                    if (this.orderGrid) {
                        this.loadOrders(null, null);
                    }
                } else {
                    if (this.orderGrid) {
                        this.orderGrid.clearData();
                        if (this.isShown) {
                            this.orderGrid.refresh();
                        }
                    }
                }
            }
        });

        this.clickSub = this.getHeaderResult().subscribe((data) => {
            this.isBind = data.isActive;
        });

    }

    dockableClose(): Promise<void> {
        if (this.transSub) {
            this.transSub.unsubscribe();
        }
        if (this.ordersSub) {
            this.ordersSub.unsubscribe();
        }
        if (this.executionSub) {
            this.executionSub.unsubscribe();
        }
        return Promise.resolve();
    }

    dockableShow() {
        if (this.orderGrid) {
            this.orderGrid.dxDataGrid.refresh();
        }
        this.orderStoreService.setShown(true);
    }
    dockableTab() {
    }
    dockableHide() {
        this.orderStoreService.setShown(false);
    }

    // TODO
    saveState() {
        this.orderGrid.saveState();
    }

    public rowClickEvent(e, closeMe: boolean = true) {
        if ((!e) || (e.rowType !== "data")) { return; }
        if (closeMe === false) {
            this.orderGrid.gridControl.rowClick(e);
        }
        this.raId = e.key;
        this.rowClick = e.data;
        this.storeRowClick = e.data;
        if (this.allowedStatus.indexOf(this.storeRowClick["OrdStatus"]) > -1) {
            this.setActionItems(true);
        } else {
            this.setActionItems();
        }
        this.dataExchangeService.pushData({ order: this.rowClick, lists: this.lists, orderStoreService: this.orderStoreService }
            , ["ORDER", "DETAIL"]);
    }

    public onDateChage(e) {
        this.orderGrid.sourceControl.clearData();
        if (e.dateTimeRange) {
            this.loadOrders(e.dateTimeRange[0], e.dateTimeRange[1]);
        } else {
            this.loadOrders(null, null);
        }
    }

    onDetailClick(item) {
        this.rowClick = item;
    }

    onRowPrepared(item) {
    }

    public reloadDataGrid() {
        if (!(this.inicialiazed && this.parentOrder)) {
            return;
        }
        this.orderGrid.sourceControl.clearData();
        this.loadOrders(null, null);
    }
}
