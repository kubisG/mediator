import { Component, OnInit, OnDestroy, ComponentFactoryResolver, Injector, ApplicationRef, Inject } from "@angular/core";
import { RestPreferencesService } from "../../rest/rest-preferences.service";
import { RestAllocationsService } from "../../rest/rest-allocations.service";
import { AllocationDialogComponent } from "../allocation-dialog/allocation-dialog.component";
import { MatDialog } from "@angular/material";
import { ActionItem } from "@ra/web-shared-fe";
import { OrdStatus } from "@ra/web-shared-fe";
import { NotifyService } from "../../core/notify/notify.service";
import { RestAccountsService } from "../../rest/rest-accounts.service";
import { RestInputRulesService } from "../../rest/rest-input-rules.service";
import { LoggerService } from "../../core/logger/logger.service";
import { OrderGridComponent } from "../../orders/order-grid/order-grid.component";
import { TraderAllocationsService } from "./trader-allocations.service";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs/internal/Subscription";
import { MessageType } from "@ra/web-shared-fe";
import { OrderAllocated } from "@ra/web-shared-fe";
import { AllocStatus } from "@ra/web-shared-fe";
import { environment } from "../../../environments/environment";
import { parseJsonMessage } from "../../core/utils";
import { DataExchangeService, DockableComponent, Dockable, DockableHooks } from "@ra/web-components";
import { GoldenLayoutComponentState } from "@embedded-enterprises/ng6-golden-layout";
import { OrderInitService } from "../../rest/order-init.service";

@Dockable({
    label: "Allocations",
    icon: "dashboard",
    single: false
})
@Component({
    selector: "ra-allocations",
    templateUrl: "./allocations.component.html",
    styleUrls: ["./allocations.component.less"],
})
export class AllocationsComponent extends DockableComponent implements OnInit, DockableHooks {

    public orderColumns = [];
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
    private allowedStatus = [OrdStatus.DoneForDay];
    private raId;
    private rowClick;
    private _showMeOnly = true;
    private dateTimeRange;
    public showAllMsg = false;
    public dateFilter = false;

    constructor(
        private restPreferencesService: RestPreferencesService,
        private restAllocationsService: RestAllocationsService,
        private toasterService: NotifyService,
        private orderInitService: OrderInitService,
        private translate: TranslateService,
        private restAccountsService: RestAccountsService,
        private allocationService: TraderAllocationsService,
        public dialog: MatDialog,
        private logger: LoggerService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
        this.orderInitService.getRowColors().then((data) => { this.rowColors = data; });
    }

    private initTableColumns() {
        this.restPreferencesService.getAppPref("allocations_columns").then((columns) => {
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
            this.orderColumns = columns;
        });
    }

    initLookupValues() {
        this.orderInitService.getLists().then((data) => {
            this.lists = data;
            this.restAccountsService.getAccounts().then(
                (accdata) => {
                    this.accounts = accdata;
                    // fill
                    this.initTableColumns();
                }
            );
        });
    }

    public rowClickEvent(e) {
        console.log("click", e);
        if ((!e) || (e.rowType !== "data")) { return; }
        this.raId = e.key;
        this.rowClick = e.data;
        if (this.allowedStatus.indexOf(this.rowClick["OrdStatus"]) > -1) {
            this.setActionItems(true);
        } else {
            this.setActionItems();
        }
    }

    onRowPrepared(item) {
    }

    public onGridInitialized(e) {
        this.allocationGrid = e;
        this.allocationGrid.loadState();
        this.loadOrders(null, null, this.showAllMsg);
    }

    public rowPushed(e) {

    }

    public loadOrders(dateFrom: Date, dateTo: Date, showAllMsg: boolean) {
        this.showAllMsg = showAllMsg;
        if ((dateFrom) && (dateFrom !== null)) {
            this.dateFilter = true;
        } else {
            this.dateFilter = false;
        }
        this.dataLoaded = false;
        this.allocationGrid.beginCustomLoading("Loading...");
        this.restAllocationsService.getAllocations(dateFrom, dateTo, !this._showMeOnly, this.showAllMsg).then((orders) => {
            parseJsonMessage(orders);
            this.allocationGrid.setData(orders, false).then(() => {
                if ((dateFrom) && (dateFrom !== null)) {
                    this.allocationGrid.columnOption("TransactTime", "format", "y/MM/dd HH:mm:ss.S");
                    this.allocationGrid.columnOption("Placed", "format", "y/MM/dd HH:mm:ss.S");
                } else {
                    this.allocationGrid.columnOption("TransactTime", "format", "HH:mm:ss.S");
                    this.allocationGrid.columnOption("Placed", "format", "HH:mm:ss.S");
                }
                this.dataLoaded = true;
                this.setActionItems();
                this.allocationGrid.endCustomLoading();
            });
        }).catch((err) => {
            this.toasterService.pop("error", "Load orders", err.message);
        });
    }

    private getRaID(alloc: any, trader: boolean): string {
        if ((trader) && (alloc.RaID)) { return alloc.RaID; }
        const rows = this.allocationGrid.sourceControl.getData();

        for (let i = 0; i < rows.length; i++) {
            if (Number(alloc.AllocID) === Number(rows[i].AllocID)) {
                return rows[i].RaID;
            }
        }
        return null;
    }

    ngOnInit(): void {
        this.setActionItems();
        this.initLookupValues();

        this.transSub = this.translate.get(["really.cancel", "new.message"])
            .subscribe((res) => this.translations = res);
        this.allocSub = this.allocationService.getRoutingMessageType(MessageType.Allocation).subscribe((alloc) => {
            if (alloc.AllocTransType) {
                this.toasterService.pop("info", this.translations["new.message"], alloc.AllocTransType +
                    " " + alloc.msgType + " " + alloc.AllocID, true, "message_allocation");
                const raId = this.getRaID(alloc, true);
                this.allocationGrid.sourceControl.update(raId, alloc);
            }
        });
        this.allocAckSub = this.allocationService.getRoutingMessageType(MessageType.AllocationAck).subscribe((alloc) => {
            this.toasterService.pop("info", this.translations["new.message"], alloc.AllocTransType +
                " " + alloc.msgType + " " + alloc.AllocID !== null ? alloc.AllocID : alloc.RaID, true, "message_allocation");
            const raId = this.getRaID(alloc, false);

            const data = {};
            if (alloc["AllocStatus"] === AllocStatus.Accepted) {
                data["Allocated"] = OrderAllocated.Allocated;
            } else {
                data["AllocRejCode"] = alloc["AllocRejCode"];
                data["Allocated"] = OrderAllocated.Rejected;
                data["AllocID"] = null;
            }
            this.allocationGrid.sourceControl.update(raId, data);
        });
    }

    public actionItemClick(item: ActionItem) {
        switch (item.icon) {
            case "call_split": {
                this.openDialog("N");
                break;
            }
        }
    }

    private setActionItems(order?: any) {
        this.actionItems = [];
        if (order) {
            this.actionItems.push({ toolTip: "Setup allocations", icon: "call_split", visible: true });
        }
    }

    /**
     * TODO : split method
     */
    openDialog(action?: string): void {
        if (action === "N") {
            const dialogRef = this.dialog.open(AllocationDialogComponent, {
                data: { data: this.rowClick, action: "N" }
            });
            const orderSub = dialogRef.afterClosed().subscribe((result) => {
                orderSub.unsubscribe();
            });
        }
    }

    public onDateChage(e) {
        this.dateTimeRange = e.dateTimeRange;
        this.allocationGrid.sourceControl.clearData();
        if (e.dateTimeRange) {
            this.loadOrders(e.dateTimeRange[0], e.dateTimeRange[1], this.showAllMsg);
        } else {
            this.loadOrders(null, null, this.showAllMsg);
        }
    }

    public changeShowAllMsg() {
        this.showAllMsg = !this.showAllMsg;
        if ((this.dateTimeRange) && (this.dateTimeRange !== null)) {
            this.loadOrders(this.dateTimeRange[0], this.dateTimeRange[1], this.showAllMsg);
        } else {
            this.loadOrders(null, null, this.showAllMsg);
        }
    }

    /**
      * Saving last table state
      */
    saveState() {
        this.allocationGrid.saveState();
    }

    dockableClose(): Promise<void> {
        if (this.transSub) {
            this.transSub.unsubscribe();
        }
        if (this.allocSub) {
            this.allocSub.unsubscribe();
        }
        if (this.allocAckSub) {
            this.allocAckSub.unsubscribe();
        }
        return Promise.resolve();
    }
    dockableShow() {
    }
    dockableTab() {
    }
    dockableHide() {
    }


}
