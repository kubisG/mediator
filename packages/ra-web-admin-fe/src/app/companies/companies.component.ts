import { Component, ViewChild, OnInit, ComponentFactoryResolver, Injector, ApplicationRef } from "@angular/core";
import { MatDialog } from "@angular/material";

import { DialogCompanyComponent } from "./dialog-company/dialog-company.component";
import { RestCompaniesService } from "../rest/rest-companies.service";
import { ToasterService, Toast } from "angular2-toaster";
import { DxDataGridComponent } from "devextreme-angular/ui/data-grid";
import { ConfirmDialogComponent, LoggerService } from "@ra/web-shared-fe";
import { Dockable, LayoutRights, DockableComponent } from "@ra/web-components";

@LayoutRights({
    roles: ["ADMIN"]
})
@Dockable({
    label: "Companies",
    icon: "list_alt",
    single: true
})
@Component({
    selector: "ra-companies",
    templateUrl: "./companies.component.html",
    styleUrls: ["./companies.component.less"]
})
export class CompaniesComponent extends DockableComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    private companySub;

    private company = {};

    gridColumns: any[] = [
        {
            caption: "Company Name",
            dataField: "companyName"
        },
        {
            cation: "Client ID",
            dataField: "ClientID"
        },
        {
            cation: "Street",
            dataField: "street"
        },
        {
            caption: "City",
            dataField: "city"
        },
        {
            caption: "State",
            dataField: "state"
        }];

    gridData: any[] = [];
    updateData: any[] = [];


    constructor(
        private companiesService: RestCompaniesService,
        private toasterService: ToasterService,
        public dialog: MatDialog,
        private logger: LoggerService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
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
                this.companiesService.saveCompany(result).then(
                    (data) => {
                        if (result.id) {
                            data.id = result.id;
                            this.updateData = [data];
                            this.toasterService.pop("info", "Company updated", data.companyName + " successfully updated");
                        } else {
                            this.updateData = [data];
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
                        this.updateData = [data];

                        // this.dataSourceControl.dataSource.store().byKey(id).then(
                        //     (dataItem) => {
                        //         const removeRes = dataItem;
                        //         this.dataSourceControl.remove(id);
                        //         this.toasterService.pop("info", "Company deleted", removeRes.companyName + " successfully deleted");
                        //     },
                        //     (error) => {
                        //         this.logger.error(error);
                        //     }
                        // );
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

    ngOnInit(): void {
        this.companiesService.getCompanies().then((data: any) => {
            this.gridData = data[0];
        }).catch(error => { this.logger.error(error); });
    }

    public onRowClick(evt) {
        console.log(evt);
    }

}
