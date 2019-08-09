import {
    Component, OnInit, ComponentFactoryResolver, Injector, ApplicationRef
} from "@angular/core";

import { HitlistSettingsService } from "../../core/hitlist-settings/hitlist-settings.service";
import { MessageType } from "@ra/web-shared-fe";
import { Subscription } from "rxjs/internal/Subscription";
import { BrokerIoiService } from "./broker-ioi.service";
import { IOITransType } from "@ra/web-shared-fe";
import { TranslateService } from "@ngx-translate/core";
import { IoiBrokerDialogComponent } from "../ioi-dialog/ioi-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { IOIType } from "@ra/web-shared-fe";
import { NotifyService } from "../../core/notify/notify.service";
import { environment } from "../../../environments/environment";
import { parseJsonMessage } from "../../core/utils";
import { ConfirmDialogComponent } from "@ra/web-shared-fe";
import { Dockable, DockableComponent, LayoutRights, DockableHooks } from "@ra/web-components";
import { OrderInitService } from "../../rest/order-init.service";

@LayoutRights({
    params: {
        ioi: true
    }
})
@Dockable({
    single: false,
    label: "IOI",
    icon: "chat"
})
@Component({
    selector: "ra-broker-ioi-table",
    templateUrl: "./ioi-table.component.html",
    styleUrls: ["./ioi-table.component.less"],
})
export class IoiBrokerTableComponent extends DockableComponent implements OnInit, DockableHooks {
    private dataGrid;

    public lists;

    public env = environment;

    public dateFilter = false;
    public dataLoaded = false;
    private ioiSub: Subscription;
    private iofiSub: Subscription;
    private transSub: Subscription;
    collapsed: boolean;
    private translations = {};
    public ioiRowClick: {};
    public columns: any[];
    public actions = [
        {
            label: "Show IOI",
            icon: "search",
            visible: (data) => {
                return true;
            },
        },
        {
            label: "Reply IOI",
            icon: "subdirectory_arrow_left",
            visible: (data) => {
                return ((data.data["IOITransType"] !== IOITransType.Cancel)
                    && (data.data["Type"] === IOIType.Incoming) && (data.data["Canceled"] !== "Y"));
            }
        },
        {
            label: "Cancel IOI",
            icon: "cancel",
            visible: (data) => {
                return !((data.data["IOITransType"] === IOITransType.Cancel)
                    || (data.data["Type"] === IOIType.Incoming) || (data.data["Canceled"] === "Y"));
            },
        },
    ];


    constructor(
        private ioiService: BrokerIoiService,
        private hitlistSettingsService: HitlistSettingsService,
        private toasterService: NotifyService,
        private translate: TranslateService,
        public dialog: MatDialog,
        private orderInitService: OrderInitService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);

        this.orderInitService.getLists().then((data) => {
            this.lists = data;
            this.columns = this.ioiService.getColumns(this.lists);
        });

    }

    public onDateChage(e) {
        if (e.dateTimeRange) {
            this.initData(e.dateTimeRange[0], e.dateTimeRange[1]);
            this.dateFilter = true;
        } else {
            this.initData(null, null);
            this.dateFilter = false;
        }
    }

    /**
     * Loads messages for user
     */
    initData(dateFrom, dateTo) {
        this.dataLoaded = true;
        this.ioiService.getIois(dateFrom, dateTo).then((messages) => {
            parseJsonMessage(messages);
            messages.map((val) => {
                val["TransactTime"] = new Date(val["TransactTime"]);
            });
            if ((dateFrom) && (dateFrom !== null)) {
                this.dataGrid.columnOption("TransactTime", "format", "y/MM/dd HH:mm:ss.S");
            } else {
                this.dataGrid.columnOption("TransactTime", "format", "HH:mm:ss.S");
            }
            this.dataGrid.setData(messages);
            this.dataLoaded = true;
        }).catch((err) => {
            this.toasterService.pop("error", "Load IOIs", err.message);
        });
    }

    /**
     * Loading last saved table state
     * @param ev Grid component
     */
    onInitialized(e) {
        this.dataGrid = e.component ? e.component : e;
        this.hitlistSettingsService.loadState("counter-party", this.dataGrid);
        this.initData(null, null);
    }

    /**
     * Saving last table state
     */
    saveState() {
        this.hitlistSettingsService.saveState("iois", this.dataGrid);
    }


    ngOnInit() {
        this.transSub = this.translate.get(["really.cancel", "new.message"])
            .subscribe((res) => this.translations = res);
        this.ioiSub = this.ioiService.getRoutingMessageType(MessageType.IOI).subscribe((ioi) => {

            if (ioi.IOITransType) {
                if (ioi.IOITransType === IOITransType.New) {
                    this.toasterService.pop("info", this.translations["new.message"], "New " + MessageType.IOI + " " + ioi.IOIid,
                        true, "message_ioi");
                    this.dataGrid.insertRow(ioi);
                } else if ((ioi.IOITransType === IOITransType.Replace) || (ioi.IOITransType === IOITransType.Cancel)) {
                    this.toasterService.pop("info", this.translations["new.message"], ioi.IOITransType +
                        " " + MessageType.IOI + " " + ioi.IOIid, true, "message_ioi");
                    this.dataGrid.updateRow(ioi);
                }
            }
        });
    }

    dockableClose(): Promise<void> {
        if (this.transSub) {
            this.transSub.unsubscribe();
        }
        if (this.ioiSub) {
            this.ioiSub.unsubscribe();
        }
        if (this.iofiSub) {
            this.iofiSub.unsubscribe();
        }
        return Promise.resolve();
    }
    dockableShow() {
    }
    dockableTab() {
    }
    dockableHide() {
    }


    public rowActionClick(e) {
        switch (e.action.label) {
            case "Show IOI": {
                this.openDialog(e.data.data, "R");
                break;
            }
            case "Reply IOI": {
                this.openDialog(e.data.data, "E");
                break;
            }
            case "Cancel IOI": {
                this.openDialog(e.data.data, "C");
                break;
            }
            default: {
                break;
            }
        }
    }

    public rowClickEvent(e) {
    }


    private confirmCancel() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: this.translations["really.cancel"] }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const message = { ...this.ioiRowClick };
                message["action"] = "C";
                this.ioiService.sendMessage(message);
            }
        });
    }


    /**
     * TODO : split method
     */
    openDialog(data, action?: string): void {
        this.ioiRowClick = data;
        if (action === "C") {
            this.confirmCancel();
        } else if (action === "R") {
            const dialogRef = this.dialog.open(IoiBrokerDialogComponent, {
                width: "70%",
                data: { data: this.ioiRowClick, action: "R" }
            });
            this.iofiSub = dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    result.action = "R";
                    this.ioiService.sendMessage(result);
                }
                this.iofiSub.unsubscribe();
            });
        } else if (action === "E") {
            const dialogRef = this.dialog.open(IoiBrokerDialogComponent, {
                width: "70%",
                data: { data: { ...this.ioiRowClick }, action: "E" }
            });
            this.iofiSub = dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    result.Text = result.NewText;
                    delete result.NewText;
                    result.action = "E";
                    this.ioiService.sendMessage(result);
                }
                this.iofiSub.unsubscribe();
            });
        } else if (action === "N") {
            const dialogRef = this.dialog.open(IoiBrokerDialogComponent, {
                width: "70%",
                data: { data: {}, action: "N" }
            });
            this.iofiSub = dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    result.action = "N";
                    this.ioiService.sendMessage(result);
                }
                this.iofiSub.unsubscribe();
            });
        }
    }

}

