import { Component, ViewChild, OnInit, ComponentFactoryResolver, Injector, ApplicationRef } from "@angular/core";
import { MatDialog } from "@angular/material";

import { DialogCompanyComponent } from "../dialog-company/dialog-company.component";
import { RestCompaniesService } from "../../rest/rest-companies.service";
import { NotifyService } from "../../core/notify/notify.service";
import { LoggerService } from "../../core/logger/logger.service";
import { Store } from "@ngxs/store";
import { AuthStateModel } from "../../core/authentication/state/auth.model";
import { AuthState } from "../../core/authentication/state/auth.state";
import { ConfirmDialogComponent } from "@ra/web-shared-fe";
import { Dockable, LayoutRights, DockableComponent } from "@ra/web-components";
import { HitlistSettingsService } from "../../core/hitlist-settings/hitlist-settings.service";

@LayoutRights({
    roles: ["ADMIN"]
})
@Dockable({
    label: "Companies",
    icon: "list_alt",
    single: false
})
@Component({
    selector: "ra-companies",
    templateUrl: "./companies.component.html",
    styleUrls: ["./companies.component.less"]
})
export class CompaniesComponent extends DockableComponent implements OnInit {
    private companySub;
    private dataGrid;

    private company = {};
    collapsed: boolean;
    public user: AuthStateModel;
    public columns;

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
        },
    ];

    constructor(
        private companiesService: RestCompaniesService,
        private toasterService: NotifyService,
        private hitlistSettingsService: HitlistSettingsService,
        public dialog: MatDialog,
        private logger: LoggerService,
        private store: Store,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
        this.user = this.store.selectSnapshot(AuthState.getUser);
        const that = this;
        this.columns = [
            { caption: "Company Name", dataField: "companyName" },
            { caption: "Client ID", dataField: "ClientID" },
            { caption: "Street", dataField: "street" },
            { caption: "City", dataField: "city" },
            {
                caption: "Identifier", dataField: "id", valueFormatter: function (data) {
                    return that.idCompany(data);
                }
            },
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

    /**
     * Loading last saved table state
     * @param ev Grid component
     */
    onInitialized(e) {
        this.dataGrid = e.compoment ? e.component : e;
        this.loadState(e);
        this.initData();
    }


    /**
     * Saving last table state
     */
    saveState() {
        this.hitlistSettingsService.saveState("company", this.dataGrid);
    }

    /**
     * Loading last saved table state
     * @param ev Grid component
     */
    loadState(ev) {
        this.hitlistSettingsService.loadState("company", ev.component ? ev.component : this.dataGrid);
    }

    /**
     * TODO : split method
     * Dialog for company details - update or insert
     */
    private openCompany() {
        const dialogRef = this.dialog.open(DialogCompanyComponent, {
            width: "300px",
            data: this.company
        });

        this.companySub = dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result);
                this.companiesService.saveCompany(result).then(
                    (data) => {
                        if (result.id) {
                            data.id = result.id;
                            this.dataGrid.updateRow(data);
                            this.toasterService.pop("info", "Company updated", data.companyName + " successfully updated");
                        } else {
                            this.dataGrid.insertRow(data);
                            this.toasterService.pop("info", "Company created", data.companyName + " successfully created");
                        }
                    })
                    .catch((error) => {
                        this.logger.error(error);
                        this.toasterService.pop("error", "Database error", error.error.message);
                    });
            }
            this.companySub.unsubscribe();
        });
    }

    private confirmDelete(id: number) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: "Are you sure to delete?" }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.companiesService.delCompany(id).then(
                    (data) => {
                        this.dataGrid.updateRow({ id });
                        this.toasterService.pop("info", "Company deleted", "Successfully deleted");
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
            this.companiesService.getCompany(id).then(
                (data) => {
                    this.company = data;
                    this.openCompany();
                })
                .catch((error) => {
                    this.company = {};
                });
        } else {
            this.company = {};
            this.openCompany();
        }

    }

    initData() {
        this.companiesService.getCompanies().then((data: any) => {
            this.dataGrid.setData(data[0]);
        }).catch(error => { this.logger.error(error); });
    }

    ngOnInit(): void {

    }

    idCompany(cellInfo) {
        return this.user.compQueueBroker.substring(0, this.user.compQueueBroker.indexOf("_") + 1)
            + (cellInfo.data ? cellInfo.data.id : cellInfo.id)
            + " / " + this.user.compQueueTrader.substring(0, this.user.compQueueTrader.indexOf("_") + 1)
            + (cellInfo.data ? cellInfo.data.id : cellInfo.id);
    }

}
