import { Component, OnInit, ViewChild, ComponentFactoryResolver, Injector, ApplicationRef } from "@angular/core";
import { MatDialog } from "@angular/material";

import { DialogCounterPartyComponent } from "../dialog-counter-party/dialog-counter-party.component";
import { NotifyService } from "../../core/notify/notify.service";
import { LoggerService } from "../../core/logger/logger.service";
import { RestCounterPartyService } from "../../rest/rest-counter-party.service";
import { DataGridService } from "../../data-grid/data-grid.service";
import { ConfirmDialogComponent } from "@ra/web-shared-fe";
import { DockableComponent, LayoutRights, Dockable } from "@ra/web-components";
import { HitlistSettingsService } from "../../core/hitlist-settings/hitlist-settings.service";
import { hitlistFormatValue } from "@ra/web-shared-fe";

@LayoutRights({
    roles: ["ADMIN", "MANAGER"]
})
@Dockable({
    label: "Counter Parties",
    icon: "low_priority",
})
@Component({
    selector: "ra-counter-party",
    templateUrl: "./counter-party.component.html",
    styleUrls: ["./counter-party.component.less"]
})
export class CounterPartyComponent extends DockableComponent implements OnInit {
    private dataGrid: any;


    public hitlistFormat = hitlistFormatValue;
    public collapsed: boolean;
    public record = {};
    public apps: any[] = [
        { id: 1, label: "Trader" },
        { id: 2, label: "Broker" }
    ];

    private dialSub;
    columns: any[];
    public actions = [
        {
            label: "Update",
            icon: "loop",
            visible: (data) => {
                return true;
            },
        },
        {
            label: "Delete",
            icon: "delete",
            visible: (data) => {
                return true;
            }
        }
    ];

    constructor(
        private toasterService: NotifyService,
        private counterPartyService: RestCounterPartyService,
        private hitlistService: HitlistSettingsService,
        public dialog: MatDialog,
        private logger: LoggerService,
        private dataGridService: DataGridService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
        const that = this;
        this.columns = [
            { caption: "ExDestination", dataField: "ExDestination" },
            { caption: "Counter Party", dataField: "CounterParty" },
            { caption: "DeliveryToCompID", dataField: "DeliveryToCompID" },
            { caption: "Other Info", dataField: "otherInfo" },
            { caption: "CommType", dataField: "CommType" },
            { caption: "Commission", dataField: "CommTCommissionype" },
            {
                caption: "Type", dataField: "type", valueFormatter: function (data) {
                    return that.hitlistFormat(data,
                        {
                            dataField: "type", dataType: "lookup",
                            lookup: { dataSource: that.apps, valueExpr: "id", displayExpr: "label" }
                        }
                    );
                }
            }
        ];

    }

    public rowActionClick(e) {
        switch (e.action.label) {
            case "Update": {
                this.openDialog(e.data.id);
                break;
            }
            case "Delete": {
                this.openDialog(e.data.id, "D");
                break;
            }
            default: {
                break;
            }
        }
    }

    loadData() {
        this.counterPartyService.getRecords().then((data: any) => {
            this.dataGrid.setData(data);
        }).catch(error => { this.logger.error(error); });
    }
    /**
     * Loading last saved table state
     * @param ev Grid component
     */
    onInitialized(e) {
        this.dataGrid = e.component ? e.component : e;
        this.hitlistService.loadState("counter-party", this.dataGrid);
        this.loadData();
    }

    /**
     * Saving last table state
     */
    saveState() {
        this.hitlistService.saveState("counter-party", this.dataGrid);
    }



    ngOnInit() {

    }

    /**
     * TODO : split method
     * Dialog for user details - update or insert
     */
    private openParty() {
        const dialogRef = this.dialog.open(DialogCounterPartyComponent, {
            data: { data: this.record }
        });

        this.dialSub = dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.counterPartyService.saveRecord(
                    result
                ).then(
                    (data) => {
                        if (result.id) {
                            data.id = result.id;
                            this.dataGrid.updateRow(data);
                            this.toasterService.pop("info", "Record updated", data.CounterParty + " successfully updated");
                        } else {
                            this.dataGrid.insertRow(data);
                            this.toasterService.pop("info", "Record created", data.CounterParty + " successfully created");
                        }
                    })
                    .catch((error) => {
                        this.toasterService.pop("error", "Database error", error.error.message);
                        this.logger.error(error);
                    });
            }
            this.dialSub.unsubscribe();
        });
    }

    private confirmDelete(id: number) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: "Are you sure to delete?" }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.counterPartyService.delRecord(id).then(
                    (data) => {
                        this.dataGrid.updateRow({ id });
                        this.toasterService.pop("info", "Record deleted", "Successfully deleted");
                    })
                    .catch((error) => {
                        this.logger.error(error);
                        this.toasterService.pop("error", "Database error", error.error.message);
                    });
            }
        });
    }

    /**
     * TODO : split method
     * Before dialog opening we want to decide if we update or delete
     * @param id User id
     * @param deleted Should we delete or update
     */
    public openDialog(id?: number, deleted?: string): void {
        if ((deleted === "D") && (id)) {
            this.confirmDelete(id);
        } else if (id) {
            this.counterPartyService.getRecord(id).then(
                (data) => {
                    this.record = data;
                    this.openParty();
                })
                .catch((error) => {
                    this.record = {};
                });
        } else {
            this.record = { id: null, company: {} };
            this.openParty();
        }
    }

}

