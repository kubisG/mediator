import { Component, ViewChild, OnInit, ComponentFactoryResolver, Injector, ApplicationRef } from "@angular/core";
import { MatDialog } from "@angular/material";

import { DialogAccountsComponent } from "../dialog-accounts/dialog-accounts.component";
import { RestAccountsService } from "../../rest/rest-accounts.service";
import { NotifyService } from "../../core/notify/notify.service";
import { DataGridService } from "../../data-grid/data-grid.service";
import { LoggerService } from "../../core/logger/logger.service";
import { RestCounterPartyService } from "../../rest/rest-counter-party.service";
import { ConfirmDialogComponent } from "@ra/web-shared-fe";
import { Dockable, LayoutRights, DockableComponent } from "@ra/web-components";
import { HitlistSettingsService } from "../../core/hitlist-settings/hitlist-settings.service";
import { hitlistFormatValue } from "@ra/web-shared-fe";
@LayoutRights({
    roles: ["ADMIN", "MANAGER"]
})
@Dockable({
    label: "Accounts",
    icon: "playlist_add_check",
})
@Component({
    selector: "ra-accounts",
    templateUrl: "./accounts.component.html",
    styleUrls: ["./accounts.component.less"]
})
export class AccountsComponent extends DockableComponent implements OnInit {
    private dataGrid: any;
    private accountSub;

    private account = {};
    public counterParties = [];
    public hitlistFormat = hitlistFormatValue;
    collapsed: boolean;
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
        private accountsService: RestAccountsService,
        private toasterService: NotifyService,
        public dialog: MatDialog,
        private counterPartyService: RestCounterPartyService,
        private hitlistService: HitlistSettingsService,
        private logger: LoggerService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
        const that = this;
        this.columns = [
            { caption: "Name", dataField: "name" },
            { caption: "Code", dataField: "code" },
            { caption: "Info", dataField: "info" },
            { caption: "Settlement 1", dataField: "settlement1" },
            { caption: "Settlement 2", dataField: "settlement2" },
            {
                caption: "Counter party", dataField: "counterParty", valueFormatter: function (data) {
                    return that.hitlistFormat(data,
                        {
                            dataField: "counterParty", dataType: "lookup",
                            lookup: { dataSource: that.counterParties, valueExpr: "id", displayExpr: "CounterParty" }
                        }
                    );
                }
            }
        ];
    }


    loadData() {
        this.accountsService.getAccounts().then((data: any) => {
            this.dataGrid.setData(data);
        }).catch(error => { this.logger.error(error); });
    }
    /**
     * Loading last saved table state
     * @param ev Grid component
     */
    onInitialized(e) {
        this.dataGrid = e.component ? e.component : e;
        this.hitlistService.loadState("accounts", this.dataGrid);
        this.loadData();
    }

    /**
     * Saving last table state
     */
    saveState() {
        this.hitlistService.saveState("accounts", this.dataGrid);
    }

    /**
     * TODO : split method
     * Dialog for company details - update or insert
     */
    private openAccount() {
        const dialogRef = this.dialog.open(DialogAccountsComponent, {
            width: "300px",
            data: this.account
        });

        this.accountSub = dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.accountsService.saveAccount(result).then(
                    (data) => {
                        if (result.id) {
                            data.id = result.id;
                            this.dataGrid.updateRow(data);
                            this.toasterService.pop("info", "Account updated", data.name + " successfully updated");
                        } else {
                            this.dataGrid.insertRow(data);
                            this.toasterService.pop("info", "Account created", data.name + " successfully created");
                        }
                    })
                    .catch((error) => {
                        this.logger.error(error);
                        this.toasterService.pop("error", "Database error", error.error.message);
                    });
            }
            this.accountSub.unsubscribe();
        });
    }

    private confirmDelete(id: number) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: "Are you sure to delete?" }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.accountsService.delAccount(id).then(
                    (data) => {
                        this.dataGrid.updateRow({ id });
                        this.toasterService.pop("info", "Account deleted", "Successfully deleted");
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
     * @param id Company id
     * @param deleted Should we delete or update
     */
    public openDialog(id?: number, deleted?: string): void {
        if ((deleted === "D") && (id)) {
            this.confirmDelete(id);
        } else if (id) {
            this.accountsService.getAccount(id).then(
                (data) => {
                    this.account = data;
                    this.openAccount();
                })
                .catch((error) => {
                    this.account = {};
                });
        } else {
            this.account = {};
            this.openAccount();
        }

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

    ngOnInit(): void {
        this.counterPartyService.getRecords().then((records: any) => {
            this.counterParties = records;
        }).catch(error => { this.logger.error(error); });
    }

}
