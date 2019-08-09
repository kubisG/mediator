import { Component, OnInit, Inject, ComponentFactoryResolver, Injector, ApplicationRef, LOCALE_ID } from "@angular/core";
import { RestPreferencesService } from "../../rest/rest-preferences.service";
import { RestCompaniesService } from "../../rest/rest-companies.service";
import { RestUsersService } from "../../rest/rest-users.service";
import { MatDialog } from "@angular/material";
import { PreferencesDialogComponent } from "../preferences-dialog/preferences-dialog.component";
import { NotifyService } from "../../core/notify/notify.service";
import { Observable } from "rxjs/internal/Observable";
import { ConfirmDialogComponent } from "@ra/web-shared-fe";
import { Dockable, LayoutRights, DockableComponent } from "@ra/web-components";
import { hitlistFormatValue } from "@ra/web-shared-fe";
import { HitlistSettingsService } from "../../core/hitlist-settings/hitlist-settings.service";

@LayoutRights({
    roles: ["ADMIN"]
})
@Dockable({
    label: "Preferences",
    icon: "playlist_add_check",
    single: false
})
@Component({
    selector: "ra-preferences",
    templateUrl: "preferences.component.html",
    styleUrls: ["preferences.component.less"]
})
export class PreferencesComponent extends DockableComponent implements OnInit {

    collapsed: boolean;
    companies: any[] = [];
    users: any[] = [];


    private dataGrid;
    public columns;
    public hitlistFormat = hitlistFormatValue;


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
        @Inject(LOCALE_ID) private locale: string,
        private hitlistSettingsService: HitlistSettingsService,
        private restPreferencesService: RestPreferencesService,
        private restCompaniesService: RestCompaniesService,
        private restUsersService: RestUsersService,
        private toasterService: NotifyService,
        public dialog: MatDialog,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
        const that = this;
        this.restCompaniesService.getCompanies().then((data) => {
            this.companies = data[0];
            this.companies.push({ id: 0, companyName: "APP" });
        });
        this.restUsersService.getUsers().then((data) => {
            this.users = data[0];
            this.users.push({ id: 0, username: "APP", email: "APP" });
        });
        this.columns = [
            {
                caption: "Company", dataField: "companyId", valueFormatter: function (data) {
                    return that.hitlistFormat(data,
                        {
                            dataField: "companyId", dataType: "lookup",
                            lookup: { dataSource: that.companies, valueExpr: "id", displayExpr: "companyName" }
                        }
                    );
                }
            },
            {
                caption: "Created", dataField: "createDate", valueFormatter: function (data) {
                    return that.hitlistFormat(data,
                        { locale: that.locale, dataField: "createDate", dataType: "date", format: "y/MM/dd" }
                    );
                }
            },
            { caption: "Name", dataField: "name" },
            {
                caption: "User", dataField: "userId", valueFormatter: function (data) {
                    return that.hitlistFormat(data,
                        {
                            dataField: "userId", dataType: "lookup",
                            lookup: { dataSource: that.users, valueExpr: "id", displayExpr: "email" }
                        }
                    );
                }
            },
            {
                caption: "value", dataField: "value"
            },
        ];
    }


    public rowActionClick(e) {
        switch (e.action.label) {
            case "Update": {
                this.editPreference(e.data.data);
                break;
            }
            case "Delete": {
                this.deletePreference(e.data.data);
                break;
            }
            default: {
                break;
            }
        }
    }

    private loadData() {
        this.restPreferencesService.getAllPrefs().then((data) => {
            this.dataGrid.setData(data);
        });
    }

    private preferenceDialog(data: any): Observable<any> {
        const dialogRef = this.dialog.open(PreferencesDialogComponent, {
            width: "95%",
            height: "680px",
            data: {
                data,
                users: this.users,
                comapnies: this.companies,
            }
        });
        return dialogRef.afterClosed();
    }


    public onInitialized(e) {
        this.dataGrid = e.compoment ? e.component : e;
        this.loadState(e);
        this.loadData();
    }

    /**
     * Saving last table state
     */
    saveState() {
        this.hitlistSettingsService.saveState("admin-prefs", this.dataGrid);
    }

    /**
     * Loading last saved table state
     * @param ev Grid component
     */
    loadState(ev) {
        this.hitlistSettingsService.loadState("admin-prefs", ev.component ? ev.component : this.dataGrid);
    }


    public newPreference() {
        this.editPreference({
            value: ""
        });
    }

    public editPreference(data: any) {
        console.log(data);
        this.preferenceDialog(data).subscribe((result) => {
            if (result) {
                this.restPreferencesService.savePref(result).then(() => {
                    this.toasterService.pop("info", "Preference", "successfully saved");
                    this.loadData();
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
                    this.loadData();
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
    }

}
