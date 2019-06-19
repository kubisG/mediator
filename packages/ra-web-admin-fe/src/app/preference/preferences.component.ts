import { Component, OnInit, ViewChild, ComponentFactoryResolver, Injector, ApplicationRef } from "@angular/core";
import { RestPreferencesService } from "../rest/rest-preferences.service";
import { DxDataGridComponent } from "devextreme-angular/ui/data-grid";
import { ToasterService, Toast } from "angular2-toaster";
import { RestCompaniesService } from "../rest/rest-companies.service";
import { RestUsersService } from "../rest/rest-users.service";
import { MatDialog } from "@angular/material";
import { PreferencesDialogComponent } from "./preferences-dialog/preferences-dialog.component";
import { Observable } from "rxjs/internal/Observable";
import { ConfirmDialogComponent } from "@ra/web-shared-fe";
import { Dockable, LayoutRights, DockableComponent } from "@ra/web-components";

@LayoutRights({
    roles: ["ADMIN"]
})
@Dockable({
    label: "Preferences",
    icon: "playlist_add_check",
    single: true
})
@Component({
    selector: "ra-preferences",
    templateUrl: "preferences.component.html",
    styleUrls: ["preferences.component.less"]
})
export class PreferencesComponent extends DockableComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    collapsed: boolean;
    companies: any[];
    users: any[];
    gridColumns: any[] = [
    {
        caption: "Company",
        dataField: "companyId"
    },
    {
        cation: "Created",
        dataField: "createDate"
    },
    {
        cation: "Name",
        dataField: "name"
    },
    {
        caption: "User",
        dataField: "userId"
    },
    {
        caption: "Value",
        dataField: "value"
    }];
    gridData: any[] = [];
    updateData: any[] = [];
    removeData: any[] = [];


    constructor(
        private restPreferencesService: RestPreferencesService,
        private restCompaniesService: RestCompaniesService,
        private restUsersService: RestUsersService,
        private toasterService: ToasterService,
        public dialog: MatDialog,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
        console.log("constructor", this);
    }


    private reloadData() {
        this.restPreferencesService.getAllPrefs().then((data) => {
            this.gridData = data;
        });
    }

    private loadData() {
        Promise.all([
            this.restCompaniesService.getCompanies().then((data) => {
                this.companies = data[0];
                this.companies.push({ id: 0, companyName: "APP" });
            }),
            this.restUsersService.getUsers().then((data) => {
                this.users = data[0];
                this.users.push({ id: 0, username: "APP", email: "APP" });
            })
        ]).then(() => {
            this.reloadData();
        });
    }

    private preferenceDialog(data: any): Observable<any> {
        const dialogRef = this.dialog.open(PreferencesDialogComponent, {
            width: "95%",
            height: "680px",
            data: {
                data,
                users: this.users,
                companies: this.companies,
            }
        });
        return dialogRef.afterClosed();
    }

    public newPreference() {
        this.editPreference({
            value: ""
        });
    }

    public editPreference(data: any) {
        this.preferenceDialog(data).subscribe((result) => {
            if (result) {
                this.restPreferencesService.savePref(result).then(() => {
                    this.toasterService.pop("info", "Preference", "successfully saved");
                    this.reloadData();
                }).catch((err) => {
                    this.toasterService.pop("error", "Preference", "not saved");
                });
            }
        });
    }

    private confirmDelete(data: any) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: "Are you sure to delete?" }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.restPreferencesService.deletePref(data.name, data.userId, data.companyId).then(() => {
                    this.toasterService.pop("info", "Preference", "successfully deleted");
                    this.reloadData();
                }).catch((err) => {
                    this.toasterService.pop("error", "Preference", "not deleted");
                });
            }
        });
    }

    public deletePreference(data: any) {
        this.confirmDelete(data);
    }

    public reloadMessageFilter() {
        this.restPreferencesService.reloadMessageFilter().then((data) => {
            this.toasterService.pop("info", "Message filter", "reloaded");
        }).catch((err) => {
            this.toasterService.pop("error", "Message filter", err);
        });
    }

    public ngOnInit(): void {
        this.loadData();
    }

    public onRowClick(evt) {
        console.log(evt);
    }
}
