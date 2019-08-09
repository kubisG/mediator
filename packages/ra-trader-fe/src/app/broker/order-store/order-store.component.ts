import { Component, OnInit, OnDestroy, ViewChild, ComponentFactoryResolver, Injector, ApplicationRef } from "@angular/core";
import { OrderGridComponent } from "../../orders/order-grid/order-grid.component";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngxs/store";
import { NotifyService } from "../../core/notify/notify.service";
import { MatDialog } from "@angular/material";
import { BrokerStoreService } from "./broker-store.service";
import { RestPreferencesService } from "../../rest/rest-preferences.service";
import { TranslateService } from "@ngx-translate/core";
import { RestInputRulesService } from "../../rest/rest-input-rules.service";
import { MoneyService } from "../../core/money/money.service";
import { RestAccountsService } from "../../rest/rest-accounts.service";
import { LoggerService } from "../../core/logger/logger.service";
import { Subscription } from "rxjs/internal/Subscription";
import { MessageType, Side, SpecType } from "@ra/web-shared-fe";
import { DropDownItem } from "@ra/web-shared-fe";
import { ActionItem } from "@ra/web-shared-fe";
import { AuthState } from "../../core/authentication/state/auth.state";
import { MessageFactoryService } from "../../orders/message-factory.service";
import { RejectDialogComponent } from "../reject-dialog/reject-dialog.component";
import { Apps } from "../../core/apps.enum";
import { MultiFillDialogComponent } from "../multi-fill-dialog/multi-fill-dialog.component";
import { BrokerAllocationsService } from "../allocations/borker-allocations.service";
import { environment } from "../../../environments/environment";
import { OrderStatusService } from "../../orders/order-status.service";
import { OrdStatus } from "@ra/web-shared-fe";
import { OrderDetailDialogComponent } from "../../orders/order-detail-dialog/order-detail-dialog.component";
import { OrderActionsDialogComponent } from "../order-actions-dialog/order-actions-dialog.component";
import { ExecType } from "@ra/web-shared-fe";
import { ConfirmDialogComponent } from "@ra/web-shared-fe";
import { CxlRejResponseTo } from "@ra/web-shared-fe";
import { SetAlertMessage, ClearMessagesCount } from "../../header/state/header.actions";

import { RestBrokerService } from "../../rest/rest-broker.service";
import { DataExchangeService } from "@ra/web-components";
import { Dockable, DockableComponent, DockableHooks } from "@ra/web-components";
import { SleuthGridDialogComponent } from "../sleuth-grid-dialog/sleuth-grid-dialog.component";

@Dockable({
    label: "Order store",
    icon: "view_list",
    single: false
}
)
@Component({
    selector: "ra-order-store",
    templateUrl: "./order-store.component.html",
    styleUrls: ["./order-store.component.less"],
})
export class OrderStoreComponent extends DockableComponent implements OnInit, DockableHooks {
    @ViewChild(OrderGridComponent, { static: true }) orderGridComponent: OrderGridComponent;

    private ordersSub: Subscription;
    private allocSub: Subscription;
    private executionSub: Subscription;
    private transSub: Subscription;
    private sleuthSub: Subscription;
    private treeActionsSub: Subscription;

    private translations = {};

    public msgCount = {
        "CFD": 0,
        "RegularBooking": 0,
        "Allocations": 0,
    };

    public bookingType = "RegularBooking";
    public opened: boolean;
    public orderColumns = [];
    public rowColors = {};
    public orderGrid: OrderGridComponent;
    public balance = { allBalance: 0, allOpenBalance: 0 };
    public lists = {};
    public accounts = [];
    public dateFilter = false;
    public dataLoaded = false;
    public inicialized = false;
    public prefs = { currency: { name: "" } };
    public allPrefs;
    public gridMenuItems: DropDownItem[] = [
        { toolTip: "butt.user.orders", icon: "people", label: "All company orders" },
        { toolTip: "butt.user.import", icon: "cloud_upload", label: "Import" },
        { toolTip: "butt.save.layout", icon: "send", label: "Save layout" },
        { toolTip: "butt.user.reload", icon: "replay", label: "Reload orders" },
    ];
    public actionItems: ActionItem[] = [];
    public rowClick: {};
    public selectedOrder;
    public raId;
    public userId;
    public selectedRows = [];
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
            label: "Sleuth grid",
            icon: "image_search",
            visible: (data) => {
                return true;
            }
        },
        {
            label: "Fill actions",
            icon: "edit",
            visible: (data) => {
                return (this.allPrefs.role !== "READER") &&
                    (this.orderStatusService.canFill(data.data) || this.orderStatusService.canDFD(data.data)) && data.data.sended !== 1;
            }
        },
        {
            label: "Accept",
            icon: "done",
            visible: (data) => {
                return (this.allPrefs.role !== "READER") && this.orderStatusService.canAccept(data.data) && data.data.sended !== 1;
            }
        },
        {
            label: "Reject",
            icon: "clear",
            visible: (data) => {
                return (this.allPrefs.role !== "READER") && this.orderStatusService.canReject(data.data) && data.data.sended !== 1;
            }
        },
        {
            label: "Done for day",
            icon: "done_outline",
            visible: (data) => {
                return (this.allPrefs.role !== "READER") && this.orderStatusService.canDFD(data.data);
            }
        },
        {
            label: "Cancel Order",
            icon: "cancel",
            visible: (data) => {
                return (this.allPrefs.role !== "READER") && this.orderStatusService.canCancel(data.data);
            }
        },
        {
            label: "Splitted",
            icon: "split",
            visible: (data) => {
                return (data.data.splitted === "Y");
            },
            display: (data) => {
                return (data.data.splitted === "Y");
            }
        },
        {
            label: "Manual Order",
            icon: "call",
            visible: (data) => {
                return (data.data.specType === SpecType.phone);
            },
            display: (data) => {
                return (data.data.specType === SpecType.phone);
            }
        }
    ];

    constructor(
        private store: Store,
        private toasterService: NotifyService,
        public dialog: MatDialog,
        private orderStoreService: BrokerStoreService,
        private restPreferencesService: RestPreferencesService,
        private translate: TranslateService,
        private listsService: RestInputRulesService,
        public moneyService: MoneyService,
        private restAccountsService: RestAccountsService,
        private logger: LoggerService,
        private messageFactoryService: MessageFactoryService,
        private route: ActivatedRoute,
        private allocationService: BrokerAllocationsService,
        private orderStatusService: OrderStatusService,
        private restBrokerService: RestBrokerService,
        private dataExchangeService: DataExchangeService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);

        this.allPrefs = this.store.selectSnapshot(AuthState.getUser);
        this.userId = this.allPrefs.userId;
    }


    public canSplit() {
        if (this.selectedOrder) {
            return this.orderStatusService.canSplit(this.selectedOrder, true);
        }
        return false;
    }

    private setGridMenuItems() {
        this.gridMenuItems = [
            { toolTip: "butt.save.layout", icon: "send", label: "Save layout" },
            { toolTip: "butt.user.reload", icon: "replay", label: "Reload orders" },
        ];
    }

    public enableSplit() {
        if (this.allPrefs.appPrefs.spliting) {
            return true;
        }
        return false;
    }
    private setupColors() {
        this.restPreferencesService.getPreferences().then((prefs) => {
            this.prefs = prefs.pref;
            this.rowColors = prefs.pref ? prefs.pref.rowColors : {};
            this.setGridMenuItems();
        });
    }

    private sendMessageAlert() {
        const count = this.getPendingCount();
        if (count > 0) {
            this.store.dispatch(new SetAlertMessage(`You have ${this.getPendingCount()} pending messages in the blotters.`));
        } else if (count === 0) {
            this.store.dispatch(new SetAlertMessage(undefined));
        }
    }

    private subscribeMessages() {
        this.ordersSub = this.orderStoreService.getRoutingMessageType(MessageType.Order).subscribe((order) => {
            this.orderGrid.pushRow(order).then((pushType) => {
                this.setHitlist(this.bookingType);
                if (this.orderStoreService.showPopUp(order)) {
                    this.toasterService.pop(pushType.type, this.translations["new.message"], order.msgType + " "
                        + (order.Side ? order.Side : "") + " " + (order.Symbol ? order.Symbol : "")
                        + " " + (order.OrderQty ? order.OrderQty : "0") + (order.Price ? "@" + order.Price : ""), true
                        , "message_order", this.isShown);
                }
                if (order.BookingType !== this.bookingType) {
                    this.msgCount[order.BookingType] = this.msgCount[order.BookingType] + 1;
                }
                this.sendMessageAlert();
            });
        });
        this.allocSub = this.allocationService.getRoutingMessageType(MessageType.Allocation).subscribe((alloc) => {
            this.msgCount["Allocations"] = this.msgCount["Allocations"] + 1;
        });
        this.executionSub = this.orderStoreService.getRoutingMessageType(MessageType.Execution).subscribe((execution) => {
            if (execution.disableStatusUpdate) {
                delete execution.OrdStatus;
            }
            this.orderGrid.updateRow(execution);
            this.sendMessageAlert();
            if (this.orderStoreService.showPopUp(execution)) {
                this.toasterService.pop("info", this.translations["new.message"], execution.msgType + " " +
                    (execution.Side ? execution.Side : "") + " " + (execution.Symbol ? execution.Symbol : "")
                    + " " + (execution.LastQty ? execution.LastQty : "0") + "@" + (execution.LastPx ? execution.LastPx : "0"), true
                    , execution && (execution.OrdStatus === OrdStatus.PartiallyFilled || execution.OrdStatus === OrdStatus.Filled)
                        ? "message_fill" : null, this.isShown);
            }
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
        if ((dateFrom) && (dateFrom !== null)) {
            this.orderGrid.columnOption("TransactTime", "format", "y/MM/dd HH:mm:ss.S");
            this.orderGrid.columnOption("Placed", "format", "y/MM/dd HH:mm:ss.S");
        } else {
            this.orderGrid.columnOption("TransactTime", "format", "HH:mm:ss.S");
            this.orderGrid.columnOption("Placed", "format", "HH:mm:ss.S");
        }
        this.orderStoreService.loadStoredOrders(dateFrom, dateTo, true, Apps.broker).then((orders) => {
            this.orderGrid.setData(orders, false).then(() => {
                this.sendMessageAlert();
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
        this.restPreferencesService.getAppPref("broker_store_columns").then((columns) => {
            for (let i = 0; i < columns.length; i++) {
                if ((columns[i].format) && (columns[i].format.precision)) {
                    columns[i].format.precision = environment.precision;
                }
                columns[i].allowEditing = false;
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
        });
    }

    private setActionItems(order?: any) {
        this.actionItems = [];
        if (this.allPrefs.role !== "READER") {
            if (this.selectedRows.length > 0) {
                this.actionItems.push({ toolTip: "Multi-deal fill", icon: "reply_all", visible: true });
                this.actionItems.push({ toolTip: "Done for day", icon: "done_outline", visible: true });
                this.actionItems.push({ toolTip: "Accept selected", icon: "done", visible: true });
                this.actionItems.push({ toolTip: "Reject selected", icon: "clear", visible: true });
            }
            this.actionItems.push({ toolTip: "Accept all cancels", icon: "done_all", visible: true });
            this.actionItems.push({ toolTip: "Reject all cancels", icon: "clear_all", visible: true });
        }
    }

    private orderActionsDialogOpen(data: any) {
        const dialogRef = this.dialog.open(OrderActionsDialogComponent, {
            data: {
                selectedOrder: data.data,
                type: 0
            }
        });
        dialogRef.afterClosed().subscribe((result) => {

        });
    }

    private commisionDialogOpen(data: any) {
        const dialogRef = this.dialog.open(OrderActionsDialogComponent, {
            data: {
                selectedOrder: data.data,
                type: 1
            }
        });
        dialogRef.afterClosed().subscribe((result) => {

        });
    }

    private multiDealFillDialogOpen() {
        const dialogRef = this.dialog.open(MultiFillDialogComponent, {
            // height: "72%", width: "72%",
            data: {
                rows: [...this.selectedRows],
                lists: this.lists
            }
        });
        dialogRef.afterClosed().subscribe((result) => {

        });
    }

    private sendDFDSelected() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: "You really want to DFD selected?" }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                for (let i = 0; i < this.selectedRows.length; i++) {
                    if (this.orderStatusService.canDFD(this.selectedRows[i])) {
                        const msg = this.messageFactoryService.dfd(this.selectedRows[i]);
                        this.orderStoreService.sendMessage(msg);
                    } else {
                        this.toasterService.pop("error", "Cant DFD order",
                            "You cant DFD order in status " + this.selectedRows[i].OrdStatus);
                    }
                }
            }
            this.selectedRows = [];
            this.setActionItems();
            this.orderGrid.rowUnCheckAllEvent({});
        });
    }

    private sendAcceptSelected() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: "You really want to accept selected?" }
        });
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                for (let i = 0; i < this.selectedRows.length; i++) {
                    if (this.orderStatusService.canAccept(this.selectedRows[i])) {
                        const canAccept = await this.childAccept(this.selectedRows[i]);
                        if (canAccept.status) {
                            const msg = this.messageFactoryService.accept(this.selectedRows[i]);
                            this.orderStoreService.sendMessage(msg);
                        } else {
                            this.toasterService.pop("error", "Cant bulk Accept order",
                                "You cant bulk Accept order " + this.selectedRows[i].ClOrdID + " because of possible child problems");
                        }
                    } else {
                        this.toasterService.pop("error", "Cant Accept order",
                            "You cant Accept order " + this.selectedRows[i].ClOrdID + " in status " + this.selectedRows[i].OrdStatus);
                    }
                }
            }
            this.selectedRows = [];
            this.setActionItems();
            this.orderGrid.rowUnCheckAllEvent({});
        });
    }

    private setOrderStatus(message: any, ordersMessages: any[]) {
        if (ordersMessages.length > 1) {
            message.OrdStatus = ordersMessages[ordersMessages.length - 2].OrdStatus;
        }
    }

    private sendReplaceCancel(data: any) {
        this.orderStoreService.getMessages(data.RaID).then((result) => {
            const message = this.messageFactoryService.reject(data);
            this.setOrderStatus(message, result);
            message.ClOrdID = data.replaceMessage.ClOrdID;
            message.OrigClOrdID = data.replaceMessage.OrigClOrdID;
            message.msgType = MessageType.OrderCancelReject;
            message.CxlRejResponseTo = CxlRejResponseTo.OrderCancelReplaceRequest;
            message.CxlRejReason = "BrokerCredit";
            message.OrdRejReason = null;
            this.orderStoreService.sendMessage(message);
        });
    }

    private sendFillOrCancel(data: any) {
        this.orderStoreService.getMessages(data.RaID).then((result) => {
            const message = this.messageFactoryService.reject(data);
            this.setOrderStatus(message, result);
            message.msgType = MessageType.OrderCancelReject;
            message.CxlRejResponseTo = CxlRejResponseTo.OrderCancelRequest;
            message.CxlRejReason = "BrokerCredit";
            message.OrdRejReason = null;
            (message as any).ExecType = null;
            this.orderStoreService.sendMessage(message);
        });
    }

    private sendRejectSelected() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: "You really want to reject selected new orders?" }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const reason = "BrokerCredit";
                const filtered = this.selectedRows.filter((order) => {
                    return this.orderStatusService.canReject(order);
                });

                for (let i = 0; i < filtered.length; i++) {
                    if (filtered[i].OrdStatus === OrdStatus.PendingCancel) {
                        this.sendFillOrCancel(filtered[i]);
                    } else if (filtered[i].OrdStatus === OrdStatus.PendingReplace) {
                        this.sendReplaceCancel(filtered[i]);
                    } else {
                        const message = this.messageFactoryService.accept(filtered[i]);
                        (message as any).OrdRejReason = "BrokerCredit";
                        (message as any).ExecType = ExecType.Rejected;
                        (message as any).OrdStatus = OrdStatus.Rejected;
                        this.orderStoreService.sendMessage(message);
                    }
                }
            }
            this.selectedRows = [];
            this.setActionItems();
            this.orderGrid.rowUnCheckAllEvent({});
        });
    }

    private sleuthDialogOpen(order?: any) {
        this.dataExchangeService.pushData({ order: order ? order : this.selectedOrder, lists: this.lists }, ["SLEUTH"]);
        const dialogRef = this.dialog.open(SleuthGridDialogComponent, {
            height: "auto"
        });
        dialogRef.afterClosed().subscribe((result) => {

        });
    }

    // private sleuthDialogOpen(order?: any) {
    //     this.dataExchangeService.pushData({ order: order ? order : this.selectedOrder, lists: this.lists }, ["SLEUTH"]);
    // }

    public splitted(data) {
        this.orderGrid.updateRow(data);
        if (this.isShown) {
            this.orderGrid.refresh();
        }
    }

    private sleuthInfoNotification() {
        this.sleuthSub = this.orderStoreService.sleuthInfo$.subscribe((data) => {
            if (data.result > 0) {
                this.toasterService.pop({
                    type: "wait",
                    title: "Sleuth",
                    body: "Click to show Sleuth grid",
                    timeout: 20000,
                    onHideCallback: () => {
                    },
                    clickHandler: (toast, isCloseButton) => {
                        if (!isCloseButton) {
                            this.sleuthDialogOpen(data.msg);
                        }
                        return true;
                    }
                });
            }
        });
    }

    private getOrderDetailDialogActions(order) {
        const appPrefs = this.store.selectSnapshot(AuthState.getAppPrefs);
        if (appPrefs.treeCancel) {
            return [
                {
                    label: "Cancel Fill",
                    icon: "clear",
                    visible: (data) => {
                        if ((!data) || (order.OrdStatus === OrdStatus.PendingReplace)
                            || (order.OrdStatus === OrdStatus.PendingCancel) || (order.OrdStatus === OrdStatus.PendingNew)) {
                            return false;
                        }
                        if (data &&
                            (OrdStatus.PartiallyFilled === data.OrdStatus || OrdStatus.Filled === data.OrdStatus
                                || OrdStatus.DoneForDay === data.OrdStatus) &&
                            (ExecType.Fill === data.ExecType || ExecType.PartialFill === data.ExecType
                                || ExecType.Trade === data.ExecType) &&
                            data.Canceled !== "Y" &&
                            data.sended !== 0
                        ) {
                            return true;
                        }
                        return false;
                    }
                }
            ];
        }
        return [];
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
                treeActions: this.getOrderDetailDialogActions(e.data.data),
            }
        });
        dialogRef.afterClosed().subscribe((result) => {

        });
    }

    private acceptAllCancels() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: "You really want to accept all cancels?" }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const data = this.orderGrid.getData();
                for (let i = 0; i < data.length; i++) {
                    if (data[i].OrdStatus === OrdStatus.PendingCancel) {
                        const accept = this.messageFactoryService.accept(data[i]);
                        this.orderStoreService.sendMessage(accept);
                    }
                }
            }
        });
    }

    private rejectAllCancels() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: "You really want to reject all cancels?" }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const data = this.orderGrid.getData();
                const messages = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].OrdStatus === OrdStatus.PendingCancel) {
                        messages.push(data[i]);
                    }
                }
                const reason = "BrokerCredit";
                for (let i = 0; i < messages.length; i++) {
                    const message = this.messageFactoryService.reject(messages[i]);
                    message.CxlRejResponseTo = CxlRejResponseTo.OrderCancelRequest;
                    message.CxlRejReason = "BrokerCredit";
                    message.OrdRejReason = null;
                    this.orderStoreService.sendMessage(message);
                }
            }
        });
    }

    private cancelOrder(data: any) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: "You really want to cancel order?" }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const msg = this.messageFactoryService.cancel(data.data);
                this.orderStoreService.sendMessage(msg);
            }
        });
    }

    public changedRow(item) {
        item.rowElement.classList.add("blink_me");
    }

    public getPendingCount() {
        if (this.orderGridComponent) {
            const data = this.orderGridComponent.getData();
            if (this.orderGridComponent.getData()) {
                let pendingCount = 0;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].OrdStatus && data[i].OrdStatus.indexOf("Pending") > -1) {
                        pendingCount++;
                    }
                }
                return pendingCount;
            }
            return 0;
        }
        return 0;
    }

    public rowActionClick(e) {
        switch (e.action.label) {
            case "Accept": {
                this.rowAcceptClick(e.data);
                break;
            }
            case "Reject": {
                this.rowRejectClick(e.data);
                break;
            }
            case "Detail": {
                this.orderDetailDialog(e);
                break;
            }
            case "Fill actions": {
                this.orderActionsDialogOpen(e.data);
                break;
            }
            case "Sleuth grid": {
                this.sleuthDialogOpen(e.data.data);
                break;
            }
            case "Splitted": {
                // nothing
                break;
            }
            case "Cancel Order": {
                this.cancelOrder(e.data);
                break;
            }
            case "Done for day": {
                this.commisionDialogOpen(e.data);
                break;
            }
            default: {
                break;
            }
        }
    }

    public actionItemClick(item: ActionItem) {
        switch (item.icon) {
            case "reply_all": {
                this.multiDealFillDialogOpen();
                this.selectedRows = [];
                this.setActionItems();
                this.orderGrid.rowUnCheckAllEvent({});
                break;
            }
            case "done_outline": {
                this.sendDFDSelected();
                break;
            }
            case "done": {
                this.sendAcceptSelected();
                break;
            }
            case "clear": {
                this.sendRejectSelected();
                break;
            }
            case "done_all": {
                this.acceptAllCancels();
                break;
            }
            case "clear_all": {
                this.rejectAllCancels();
                break;
            }
            case "image_search": {
                this.sleuthDialogOpen();
                break;
            }
        }
    }

    private saveState() {
        this.orderGrid.saveState();
    }

    private reloadDataGrid() {
        this.orderGrid.clearData();
        this.loadOrders(null, null);
    }

    public gridMenuItemClick(item: DropDownItem) {
        switch (item.icon) {
            case "people": {
                // this.showMeOnly();
                this.setGridMenuItems();
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

    public onDateChage(e) {
        this.orderGrid.clearData();
        if (e.dateTimeRange) {
            this.loadOrders(e.dateTimeRange[0], e.dateTimeRange[1]);
        } else {
            this.loadOrders(null, null);
        }
    }

    onDetailClick(item) {
        this.rowClick = item;
    }

    public async rowAcceptClick(event) {
        const canAccept = await this.childAccept(event.data);
        if (canAccept.status) {
            const msg = this.messageFactoryService.accept(event.data);
            this.orderStoreService.sendMessage(msg);
        } else {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: { text: canAccept.text }
            });
            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    const msg = this.messageFactoryService.accept(event.data);
                    this.orderStoreService.sendMessage(msg);
                }
            });
        }
    }

    async childAccept(data): Promise<any> {
        if (data.splitted === "Y") {
            const qty = await this.restBrokerService.getChildsQty(data.RaID);

            if (data.replaceMessage && qty > data.replaceMessage.OrderQty) {
                return { status: false, text: "Possible overfill in child orders, really accept?" };
            } else {
                const price = await this.restBrokerService.getChildsPrice(data.RaID, data.Side);

                if ((data.Side === Side.Buy) && (price > data.Price)) {
                    return { status: false, text: "Possible higher price in child orders, really accept?" };
                } else if ((data.Side === Side.Sell) && (price < data.Price)) {
                    return { status: false, text: "Possible lower price in child orders, really accept?" };
                }
            }
        }
        return { status: true, text: "" };
    }

    public rowRejectClick(event) {
        const dialogRef = this.dialog.open(RejectDialogComponent, {
            data: { ...event.data }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.orderStoreService.sendMessage(result);
            }
        });
    }

    public rowCheck(event) {
        this.selectedRows = event;
        this.setActionItems();
    }

    public setHitlist(type) {
        this.bookingType = type;
        this.msgCount[type] = 0;
        if ((this.orderGrid) && (this.orderGrid.dxDataGrid) && (this.orderGrid.dxDataGrid !== null)
            && (typeof this.orderGrid.dxDataGrid.filter === "function")) {
            if (!this.dateFilter) {
                this.orderGrid.filter([
                    ["BookingType", "=", this.bookingType],
                    //                    ["OrdStatus", "<>", OrdStatus.DoneForDay]
                ]);
            } else {
                this.orderGrid.filter([
                    ["BookingType", "=", this.bookingType],
                ]);
            }

        }
    }

    public onGridInitialized(e) {
        this.orderGrid = e;
        this.orderGrid.loadState().then((data) => {
            setTimeout(() => {
                this.setHitlist(this.bookingType);
            }, 0);
            this.inicialized = true;
            if (this.dataLoaded) {
                this.orderGrid.endCustomLoading();
            }
        });
        this.loadOrders(null, null);
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
        this.selectedOrder = e.data;
        this.setActionItems();
        if (this.canSplit()) {
            this.dataExchangeService.pushData({
                order: this.rowClick, lists: this.lists, orderStoreService: this.orderStoreService
                , treeActions: this.getOrderDetailDialogActions(e.data)
            }, ["SPLIT", "ORDER", "DETAIL", "SLEUTH"]);
        } else {
            this.dataExchangeService.pushData({
                order: this.rowClick, lists: this.lists, orderStoreService: this.orderStoreService
                , treeActions: this.getOrderDetailDialogActions(e.data)
            }, ["ORDER", "DETAIL", "SLEUTH"]);

        }

        // this.storeRowClick = e.data;
        // if (this.allowedStatus.indexOf(this.storeRowClick["OrdStatus"]) > -1) {
        //     this.setActionItems(true);
        // } else {
        //     this.setActionItems();
        // }
    }

    public onRowPrepared(item) {

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
                this.logger.error(error);
                this.lists = [];
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
        if (this.allocSub) {
            this.allocSub.unsubscribe();
        }
        if (this.sleuthSub) {
            this.sleuthSub.unsubscribe();
        }
        if (this.treeActionsSub) {
            this.treeActionsSub.unsubscribe();
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


    ngOnInit(): void {

        this.route.params.subscribe(params => {
            this.bookingType = params["id"] ? params["id"] : this.bookingType;
        });
        this.transSub = this.translate.get(["really.cancel", "new.message"])
            .subscribe((res) => this.translations = res);

        this.dataSub = this.dataExchangeService.getData().subscribe((data) => {
            if ((data.key.indexOf("SPLITTED") > -1) && (data.data) && (data.data !== null)) {
                this.splitted(data.data.order);
            }
        });

        this.initLookupValues();
        this.subscribeMessages();
        this.setupColors();
        this.setActionItems();
        this.sleuthInfoNotification();
    }

}
