import { Component, OnInit, OnDestroy, ViewChild, ComponentFactoryResolver, Injector, ApplicationRef, Inject } from "@angular/core";
import { Store } from "@ngxs/store";

import { MatDialog } from "@angular/material";
import { TraderStoreService } from "./trader-store.service";

import { OrderDialogComponent } from "../../orders/order-dialog/order-dialog.component";
import { Subscription } from "rxjs/internal/Subscription";
import { NotifyService } from "../../core/notify/notify.service";
import { RestPreferencesService } from "../../rest/rest-preferences.service";
import { MessageType } from "@ra/web-shared-fe";
import { AuthState } from "../../core/authentication/state/auth.state";
import { TranslateService } from "@ngx-translate/core";
import { CancelDialogComponent } from "../../orders/cancel-dialog/cancel-dialog.component";
import { MoneyService } from "../../core/money/money.service";
import { RestInputRulesService } from "../../rest/rest-input-rules.service";
import { OrdStatus } from "@ra/web-shared-fe";
import { ActionItem } from "@ra/web-shared-fe";
import { DropDownItem } from "@ra/web-shared-fe";
import { RestAccountsService } from "../../rest/rest-accounts.service";
import { OrderGridComponent } from "../../orders/order-grid/order-grid.component";
import { MessageFactoryService } from "../../orders/message-factory.service";
import { Apps } from "../../core/apps.enum";
import { environment } from "../../../environments/environment";
import { OrderDetailDialogComponent } from "../../orders/order-detail-dialog/order-detail-dialog.component";
import { EikonService } from "../../eikon/eikon.service";
import { ConfirmDialogComponent } from "@ra/web-shared-fe";
import { AppType } from "@ra/web-shared-fe";
import { DockableComponent, Dockable, DataExchangeService, DockableHooks } from "@ra/web-components";
import { GoldenLayoutComponentState } from "@embedded-enterprises/ng6-golden-layout";
import { ClearMessagesCount } from "../../header/state/header.actions";

@Dockable({
    label: "Blotter",
    icon: "home",
    single: false
})
@Component({
    selector: "ra-blotter-store",
    templateUrl: "./order-store.component.html",
    styleUrls: ["./order-store.component.less"],
})
export class OrderStoreComponent extends DockableComponent implements OnInit, DockableHooks {
    @ViewChild("file", { static: true }) file;

    private allowedStatus = [OrdStatus.New, OrdStatus.PartiallyFilled, OrdStatus.Filled, OrdStatus.Replaced,
    OrdStatus.PendingNew, OrdStatus.PendingReplace];
    public rowColors = {};
    private translations = {};
    private orderSub: Subscription;
    private ordersSub: Subscription;
    private executionSub: Subscription;
    private transSub: Subscription;
    public dataLoaded = false;
    public inicialized = false;

    public opened: boolean;

    public bookingType = "RegularBooking";
    public rowClick: {};
    public storeRowClick: {};
    public lists = {};
    public accounts = [];
    public prefs = { currency: { name: "" } };
    public allPrefs;

    public raId;

    public dateFilter = false;
    public _showMeOnly = true;
    private userId: number = null;
    public orderColumns = [];
    public msgCount = {
        "CFD": 0,
        "RegularBooking": 0
    };

    private infoSub: Subscription;
    private eikonSub: Subscription;
    private cancelSub: Subscription;

    public balance = { allBalance: 0, allOpenBalance: 0 };

    public orderGrid: OrderGridComponent;

    public actionItems: ActionItem[] = [];
    public gridMenuItems: DropDownItem[] = [
        { toolTip: "butt.user.orders", icon: "people", label: "All company orders" },
        { toolTip: "butt.save.layout", icon: "send", label: "Save layout" },
        { toolTip: "butt.user.reload", icon: "replay", label: "Reload orders" },
    ];

    public rowActions = [
        {
            label: "Detail",
            icon: "visibility",
            visible: (data) => {
                return true;
            },
            color: (data) => {
                return (data.data.OrdStatus === OrdStatus.PendingReplace);
            }
        },
        {
            label: "Replace",
            icon: "swap",
            visible: (data) => {
                return ((this.allPrefs.role !== "READER")
                    && this.allowedStatus.indexOf(data.data["OrdStatus"]) > -1 && data.data.sended !== 1);
            }
        },
        {
            label: "Cancel",
            icon: "clear",
            visible: (data) => {
                return (this.allPrefs.role !== "READER")
                    && this.allowedStatus.indexOf(data.data["OrdStatus"]) > -1 && data.data.sended !== 1;
            }
        }
    ];

    constructor(
        private store: Store,
        private toasterService: NotifyService,
        public dialog: MatDialog,
        public orderStoreService: TraderStoreService,
        private restPreferencesService: RestPreferencesService,
        private translate: TranslateService,
        public moneyService: MoneyService,
        private restAccountsService: RestAccountsService,
        private messageFactoryService: MessageFactoryService,
        private listsService: RestInputRulesService,
        private eikonService: EikonService,
        private dataExchangeService: DataExchangeService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
        this.allPrefs = this.store.selectSnapshot(AuthState.getUser);
        this.userId = this.allPrefs.id;
    }

    public onGridInitialized(e) {
        this.orderGrid = e;
        this.loadOrders(null, null);
    }

    private subscribeMessages() {
        this.ordersSub = this.orderStoreService.getRoutingMessageType(MessageType.Order).subscribe((order) => {
            if (this._showMeOnly && order.userId && Number(order.userId) !== Number(this.userId)) {
                return;
            }
            this.orderGrid.pushRow(order).then((pushType) => {
                this.setHitlist(this.bookingType);
                if (this.orderStoreService.showPopUp(order)) {
                    this.toasterService.pop(pushType.type, this.translations["new.message"], order.msgType + " " +
                        (order.Side ? order.Side : "") + " " + (order.Symbol ? order.Symbol : "")
                        + " " + (order.OrderQty ? order.OrderQty : (order.replaceMessage ? order.replaceMessage.OrderQty : "0"))
                        + (order.Price ? "@" + order.Price : "")
                        , true, "message_order");
                }
                if (order.BookingType !== this.bookingType) {
                    this.msgCount[order.BookingType] = this.msgCount[order.BookingType] + 1;
                }
            });
        });
        this.executionSub = this.orderStoreService.getRoutingMessageType(MessageType.Execution).subscribe((execution) => {
            if (this._showMeOnly && execution.userId && Number(execution.userId) !== Number(this.userId)) {
                return;
            }
            if (execution.disableStatusUpdate) {
                delete execution.OrdStatus;
            }
            this.orderGrid.updateRow(execution);
            if (this.orderStoreService.showPopUp(execution)) {
                this.toasterService.pop("info", this.translations["new.message"], execution.msgType + " " +
                    (execution.Side ? execution.Side : "") + " " + (execution.Symbol ? execution.Symbol : "")
                    + " " + (execution.LastQty ? execution.LastQty : "0") + "@" + (execution.LastPx ? execution.LastPx : "0"), true
                    , execution && (execution.OrdStatus === OrdStatus.PartiallyFilled || execution.OrdStatus === OrdStatus.Filled)
                        ? "message_fill" : null);
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


    initLookupValues() {
        if (this.orderGrid) {
            this.orderGrid.beginCustomLoading("Loading...");
        }
        this.listsService.getInputRules().then(
            (data) => {
                data = data.sort((a, b) => a.name.localeCompare(b.name));
                for (let i = 0; i < data.length; i++) {
                    if (!this.lists[data[i].label]) {
                        this.lists[data[i].label] = [];
                    }
                    this.lists[data[i].label].push({ name: data[i].name, value: data[i].value });
                }
                this.restAccountsService.getAccounts().then(
                    (accdata) => {
                        this.accounts = accdata;
                        // fill
                        this.initTableColumns();
                    }
                );
            })
            .catch((error) => {
                this.toasterService.pop("error", "Load init data", error.message);
                this.lists = [];
            });
    }

    private loadOrders(dateFrom: Date, dateTo: Date) {
        if ((dateFrom) && (dateFrom !== null)) {
            this.dateFilter = true;
        } else {
            this.dateFilter = false;
        }
        this.dataLoaded = false;
        this.orderGrid.beginCustomLoading("Loading...");
        this.orderStoreService.loadStoredOrders(dateFrom, dateTo, true, Apps.trader).then((orders) => {
            this.orderGrid.setData(orders, false).then(() => {
                if ((dateFrom) && (dateFrom !== null)) {
                    this.orderGrid.columnOption("TransactTime", "format", "y/MM/dd HH:mm:ss.S");
                    this.orderGrid.columnOption("Placed", "format", "y/MM/dd HH:mm:ss.S");
                } else {
                    this.orderGrid.columnOption("TransactTime", "format", "HH:mm:ss.S");
                    this.orderGrid.columnOption("Placed", "format", "HH:mm:ss.S");
                }
                setTimeout(() => {
                    this.setHitlist(this.bookingType);
                }, 0);
                if (this.inicialized) {
                    this.orderGrid.endCustomLoading();
                }
                this.dataLoaded = true;
            });
        }).catch((err) => {
            this.toasterService.pop("error", "Load orders", err.message);
        });
    }

    private initTableColumns() {
        const that = this;
        this.restPreferencesService.getAppPref("order_store_columns").then((columns) => {
            for (let i = 0; i < columns.length; i++) {
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
            that.inicialized = true;
            if (this.orderGrid && this.dataLoaded) {
                this.orderGrid.endCustomLoading();
            }
        });
    }

    private setupColors() {
        this.restPreferencesService.getPreferences().then((prefs) => {
            this.prefs = prefs.pref;
            this.rowColors = prefs.pref ? prefs.pref.rowColors : {};
            this._showMeOnly = (prefs.pref && prefs.pref.showMeOnly === false) ? false : true;
        });
    }

    private setActionItems(order?: any) {
        this.actionItems = [];
        if (this.allPrefs.role !== "READER") {
            this.actionItems.push({ toolTip: "New order", icon: "control_point", visible: true });
            this.actionItems.push({ toolTip: "Cancel all", icon: "flash_on", visible: true });
        }
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

    private setEikon() {
        this.eikonSub = this.eikonService.enabled$.subscribe((enabled) => {
            if (enabled) {
                this.rowActions.push({
                    label: "Quote",
                    icon: "timeline",
                    visible: (data) => {
                        return true;
                    }
                });
            }
        });
    }

    public cancelAllResponse() {
        this.cancelSub = this.orderStoreService.cancelAllResult$.subscribe((data) => {
            if (data.resultCount === 0) {
                const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                    data: {
                        text: "No orders for cancel",
                        type: 1,
                    }
                });
                dialogRef.afterClosed().subscribe((result) => {

                });
            }
        });
    }

    public changedRow(item) {
        item.rowElement.classList.add("blink_me");
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
            case "flash_on": {
                this.openCancelAll();
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
            case "Quote": {
                this.eikonService.openApp("Quote Object", {
                    entities: [{
                        RIC: e.data.data.Symbol
                    }]
                });
                break;
            }
            default: {
                break;
            }
        }
    }

    public gridMenuItemClick(item: DropDownItem) {
        switch (item.icon) {
            case "people": {
                this.showMeOnly();
                break;
            }
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
            data: { text: "Are you sure to cancel?" }
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
            this.confirmCancel(data.replaceMessage ? data.replaceMessage : data);
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
            const dialogRef = this.dialog.open(OrderDialogComponent, {
                width: "40%",
                data: { data: {}, action: "N", appType: AppType.Broker }
            });
            this.orderSub = dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    const message = this.messageFactoryService.newOrder(result);
                    this.orderStoreService.sendMessage(message);
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

    /**
     * Data to orderstore has to be loaded at the end
     * First loaded InitLookup, than columns and than data
     * If this order is different, grid sometimes failed
     */
    ngOnInit() {
        this.setEikon();
        this.transSub = this.translate.get(["really.cancel", "new.message"])
            .subscribe((res) => this.translations = res);
        this.infoSub = this.orderStoreService.balanceInfo$.subscribe((balance) => {
            this.moneyService.setBalance(balance);
            this.balance = this.moneyService.balance;
        });
        this.initLookupValues();
        this.subscribeMessages();
        this.setupColors();
        this.setActionItems();
        this.cancelAllResponse();
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
        if (this.infoSub) {
            this.infoSub.unsubscribe();
        }
        if (this.eikonSub) {
            this.eikonSub.unsubscribe();
        }
        if (this.cancelSub) {
            this.cancelSub.unsubscribe();
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


    public closeSideBar(event) {
        this.opened = event.opened;
    }

    public rowClickEvent(e, closeMe: boolean = true) {
        if ((!e) || (e.rowType !== "data")) { return; }
        if (closeMe === false) {
            this.orderGrid.gridControl.rowClick(e);
        }
        this.raId = e.key;
        if ((this.rowClick === e.data) && closeMe) {
            this.opened = !this.opened;
        } else {
            this.opened = true;
        }
        this.rowClick = e.data;
        this.storeRowClick = e.data;


        this.dataExchangeService.pushData({
            order: this.rowClick, lists: this.lists, orderStoreService: this.orderStoreService
        }, ["ORDER", "SYMBOL", "DETAIL"]);


        if (this.allowedStatus.indexOf(this.storeRowClick["OrdStatus"]) > -1) {
            this.setActionItems(true);
        } else {
            this.setActionItems();
        }
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

    /**
     * Click on fills will change page nad highlight
     *
     * @param raId Id of row
     */
    onFillsClick(raId) {
        let absoluteRowIndex;
        const store = this.orderGrid.sourceControl.getStore();
        const sort = this.orderGrid.sourceControl.getSort();
        const filtr = this.orderGrid.sourceControl.getFilter();

        store.load({ sort: sort, filter: filtr }).then((data) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].RaID === raId) {
                    absoluteRowIndex = i;
                    break;
                }
            }
            const pgSize = this.orderGrid.dxDataGrid.pageSize();
            const pageIndex = Math.floor(absoluteRowIndex / pgSize);
            const visibleRowIndex = absoluteRowIndex - (pageIndex * pgSize);
            this.orderGrid.dxDataGrid.pageIndex(pageIndex).then(() => {
                const visibleRows = this.orderGrid.dxDataGrid.getVisibleRows();
                this.rowClickEvent(visibleRows[visibleRowIndex], false);
            });
        });
    }

    onRowPrepared(item) {

    }

    public showMeOnly() {
        this._showMeOnly = !this._showMeOnly;
        this.restPreferencesService.updatePref({ name: "showMeOnly", value: this._showMeOnly }).then(() => {
            this.orderGrid.sourceControl.clearData();
            this.loadOrders(null, null);
            // }).catch((err) => {
            //     this.toasterService.pop("error", "Save show me only", err.message);
        });
    }

    public reloadDataGrid() {
        this.orderGrid.sourceControl.clearData();
        this.loadOrders(null, null);
    }

    /**
     * Filter hitlist by tab
     * @param type hitlist RegularBooking/CFD
     */
    public setHitlist(type) {
        this.bookingType = type;
        this.msgCount[type] = 0;
        if (this.orderGrid.dxDataGrid) {
            if (!this.dateFilter) {

                this.orderGrid.dxDataGrid.filter([
                    ["BookingType", "=", this.bookingType],
                    // ["OrdStatus", "<>", OrdStatus.DoneForDay]
                ]);
            } else {
                this.orderGrid.dxDataGrid.filter([
                    ["BookingType", "=", this.bookingType],
                ]);
            }
        }
    }

    public openCancelAll() {
        const dialogRef = this.dialog.open(CancelDialogComponent, {
            data: { type: "Trader" },
            width: "300pt"
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.orderStoreService.cancelAll(result);
            }
        });
    }
}
