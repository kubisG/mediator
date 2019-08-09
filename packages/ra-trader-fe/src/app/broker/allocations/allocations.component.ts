import { Component, OnInit, OnDestroy, ComponentFactoryResolver, Injector, ApplicationRef } from "@angular/core";
import { RestPreferencesService } from "../../rest/rest-preferences.service";
import { RestAllocationsService } from "../../rest/rest-allocations.service";
import { AllocationDialogComponent } from "../allocation-dialog/allocation-dialog.component";
import { MatDialog } from "@angular/material";
import { ActionItem } from "@ra/web-shared-fe";
import { NotifyService } from "../../core/notify/notify.service";
import { RestAccountsService } from "../../rest/rest-accounts.service";
import { RestInputRulesService } from "../../rest/rest-input-rules.service";
import { LoggerService } from "../../core/logger/logger.service";
import { OrderGridComponent } from "../../orders/order-grid/order-grid.component";
import { AllocTransType } from "@ra/web-shared-fe";
import { BrokerAllocationsService } from "./borker-allocations.service";
import { MessageType } from "@ra/web-shared-fe";
import { Subscription } from "rxjs/internal/Subscription";
import { TranslateService } from "@ngx-translate/core";
import { DropDownItem } from "@ra/web-shared-fe";
import { BrokerStoreService } from "../order-store/broker-store.service";
import { environment } from "../../../environments/environment-broker.prod";
import { parseJsonMessage } from "../../core/utils";
import { Store } from "@ngxs/store";
import { AuthState } from "../../core/authentication/state/auth.state";
import { Dockable, DockableComponent, DockableHooks } from "@ra/web-components";

@Dockable({
    label: "Allocations",
    icon: "dashboard",
    single: false
})
@Component({
    selector: "ra-broker-allocations-grid",
    templateUrl: "./allocations.component.html",
    styleUrls: ["./allocations.component.less"],
})
export class AllocationsComponent extends DockableComponent implements OnInit, DockableHooks {

    public allocColumns = [];
    public msgCount = {
        "CFD": 0,
        "RegularBooking": 0,
        "Allocations": 0,
    };
    public bookingType = "Allocations";
    public opened: boolean;
    public dataLoaded = false;
    public lists = {};
    public accounts = [];
    public rowColors = {};
    private translations = {};
    public allocationGrid: OrderGridComponent;
    public actionItems: ActionItem[] = [];
    private allocSub: Subscription;
    private allocAckSub: Subscription;
    private transSub: Subscription;
    private ordersSub: Subscription;
    private allowedStatus = [AllocTransType.New];
    public rowClick: {};
    public dateFilter = false;
    public allPrefs;

    public gridMenuItems: DropDownItem[] = [
        { toolTip: "butt.save.layout", icon: "send", label: "Save layout" },
        { toolTip: "butt.user.reload", icon: "replay", label: "Reload orders" },
    ];

    constructor(
        private store: Store,
        private restPreferencesService: RestPreferencesService,
        private restAllocationsService: RestAllocationsService,
        private toasterService: NotifyService,
        private translate: TranslateService,
        private listsService: RestInputRulesService,
        private restAccountsService: RestAccountsService,
        private allocationService: BrokerAllocationsService,
        private orderStoreService: BrokerStoreService,
        public dialog: MatDialog,
        private logger: LoggerService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
        this.allPrefs = this.store.selectSnapshot(AuthState.getUser);
    }

    private initTableColumns() {
        this.restPreferencesService.getAppPref("brokeralloc_columns").then((columns) => {
            if (columns) {
                for (let i = 0; i < columns.length; i++) {
                    if ((columns[i].format) && (columns[i].format.precision)) {
                        columns[i].format.precision = environment.precision;
                    }
                    if (columns[i].lookup) {
                        columns[i].lookup = { "dataSource": this.lists[columns[i].dataField], "displayExpr": "name", "valueExpr": "value" };
                    }
                    if (columns[i].lookup2) {
                        columns[i].lookup = { "dataSource": this.accounts, "displayExpr": "name", "valueExpr": "name" };
                    }
                }
            }
            this.allocColumns = columns;
        });
    }

    initLookupValues() {
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

    public rowClickEvent(e) {
        if ((!e) || (e.rowType !== "data")) { return; }
        this.allocationGrid.gridControl.rowClick(e);
        if (this.rowClick === e.data) {
            this.opened = !this.opened;
        } else {
            this.opened = true;
        }
        this.rowClick = e.data;
        if (this.allowedStatus.indexOf(this.rowClick["AllocTransType"]) > -1) {
            this.setActionItems(true);
        } else {
            this.setActionItems();
        }

    }

    public onRowPrepared(item) {
        if (item.data) {
            if ((item.data["AllocTransType"]) && (item.data["AllocTransType"] === AllocTransType.Cancel)) {
                item.rowElement.classList.add("canceled");
            }
        }
    }

    public onGridInitialized(e) {
        this.allocationGrid = e;
        this.loadOrders(null, null);
    }

    public rowPushed(e) {

    }

    public closeSideBar(event) {
        this.opened = event.opened;
    }

    public loadOrders(dateFrom: Date, dateTo: Date) {
        if ((dateFrom) && (dateFrom !== null)) {
            this.dateFilter = true;
        } else {
            this.dateFilter = false;
        }
        this.dataLoaded = false;
        this.allocationGrid.beginCustomLoading("Loading...");
        this.restAllocationsService.getBrokerAlloc(dateFrom, dateTo).then((orders) => {
            parseJsonMessage(orders);
            this.allocationGrid.setData(orders).then(() => {
                if ((dateFrom) && (dateFrom !== null)) {
                    this.allocationGrid.columnOption("TransactTime", "format", "y/MM/dd HH:mm:ss.S");
                    this.allocationGrid.columnOption("Placed", "format", "y/MM/dd HH:mm:ss.S");
                } else {
                    this.allocationGrid.columnOption("TransactTime", "format", "HH:mm:ss.S");
                    this.allocationGrid.columnOption("Placed", "format", "HH:mm:ss.S");
                }
                this.dataLoaded = true;
                this.allocationGrid.endCustomLoading();
            });
        }).catch((err) => {
            this.toasterService.pop("error", "Load orders", err.message);
        });
    }


    private getID(alloc: any): string {
        const rows = this.allocationGrid.sourceControl.getData();
        const id = alloc.RefAllocID ? alloc.RefAllocID : alloc.AllocID;
        for (let i = 0; i < rows.length; i++) {
            if (id === rows[i].AllocID) {
                return rows[i].id;
            }
        }
        return null;
    }

    ngOnInit() {
        this.initLookupValues();
        this.initTableColumns();
        this.setActionItems();
        this.transSub = this.translate.get(["really.cancel", "new.message"])
            .subscribe((res) => this.translations = res);
        this.allocSub = this.allocationService.getRoutingMessageType(MessageType.Allocation).subscribe((alloc) => {
            if (alloc.AllocTransType) {
                if (alloc.AllocTransType === AllocTransType.New) {
                    this.toasterService.pop("info", this.translations["new.message"], "New "
                        + alloc.msgType + " " + alloc.AllocID, true, "message_allocation");
                    alloc.id = "A" + alloc.AllocID;
                    this.allocationGrid.sourceControl.insert(alloc);

                } else if ((alloc.AllocTransType === AllocTransType.Replace) || (alloc.AllocTransType === AllocTransType.Cancel)) {
                    this.toasterService.pop("info", this.translations["new.message"], alloc.AllocTransType +
                        " " + alloc.msgType + " " + (alloc.AllocID !== null ? alloc.AllocID : alloc.RefAllocID),
                        true, "message_allocation");
                    const id = this.getID(alloc);
                    this.allocationGrid.sourceControl.update(id, alloc);
                }
            }
        });
        this.allocAckSub = this.allocationService.getRoutingMessageType(MessageType.AllocationAck).subscribe((alloc) => {
            this.toasterService.pop("info", this.translations["new.message"], alloc.AllocTransType +
                " " + alloc.msgType + " " + alloc.AllocID, true, "message_allocation");
            const id = this.getID(alloc);
            this.allocationGrid.sourceControl.update(id, alloc);
        });
        this.ordersSub = this.orderStoreService.getRoutingMessageType(MessageType.Order).subscribe((order) => {
            this.msgCount[order.BookingType] = this.msgCount[order.BookingType] + 1;
        });
    }

    public actionItemClick(item: ActionItem) {
        if (item) {
            switch (item.icon) {
                case "call_split": {
                    this.openDialog("N");
                    break;
                }
            }
        }
    }

    public reloadDataGrid() {
        this.allocationGrid.sourceControl.clearData();
        this.loadOrders(null, null);
    }

    saveState() {
        this.allocationGrid.saveState();
    }

    public gridMenuItemClick(item: ActionItem) {
        if (item) {
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
    }
    private setActionItems(order?: any) {
        this.actionItems = [];
        if ((this.allPrefs.role !== "READER") && (order)) {
            this.actionItems.push({ toolTip: "Allocate order", icon: "call_split", visible: true });
        }
    }

    openDialog(action?: string): void {
        if (action === "N") {
            // WO for changedetection :/
            Promise.resolve().then(() => {
                const dialogRef = this.dialog.open(AllocationDialogComponent, {
                    width: "70%",
                    data: { data: this.rowClick, action: "N" }
                });
                const orderSub = dialogRef.afterClosed().subscribe((result) => {
                    orderSub.unsubscribe();
                });
            });
        }
    }

    public onDateChage(e) {
        this.allocationGrid.sourceControl.clearData();
        if (e.dateTimeRange) {
            this.loadOrders(e.dateTimeRange[0], e.dateTimeRange[1]);
        } else {
            this.loadOrders(null, null);
        }
    }

    dockableClose() {
        if (this.transSub) {
            this.transSub.unsubscribe();
        }
        if (this.allocSub) {
            this.allocSub.unsubscribe();
        }
        if (this.allocAckSub) {
            this.allocAckSub.unsubscribe();
        }
        if (this.ordersSub) {
            this.ordersSub.unsubscribe();
        }
        return Promise.resolve();
    }

    dockableShow() { }

    dockableTab() { }

    dockableHide() { }


}
