import { Component, OnInit, ViewChild, ComponentFactoryResolver, Injector, ApplicationRef } from "@angular/core";
import { MatDialog } from "@angular/material";


import { DialogUserComponent } from "./dialog-user/dialog-user.component";
import { RestUsersService } from "../rest/rest-users.service";
import { ConfirmDialogComponent, LoggerService } from "@ra/web-shared-fe";
import { Dockable, LayoutRights, DockableComponent } from "@ra/web-components";
import { ToasterService } from "angular2-toaster";

@LayoutRights({
    roles: ["ADMIN"]
})
@Dockable({
    label: "Users",
    icon: "perm_identity",
    single: true
})
@Component({
    selector: "ra-users",
    templateUrl: "./users.component.html",
    styleUrls: ["./users.component.less"]
})
export class UsersComponent extends DockableComponent implements OnInit {

    private userSub;
    private user = {};
    private prefs = {};

    private dataGrid;
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
        {
            label: "Log user",
            icon: "event_note",
            visible: (data) => {
                return true;
            },
            color: (d) => {
                return this.prefs[d.data.id + "-" + d.data.company.id]
                    && this.prefs[d.data.id + "-" + d.data.company.id].logging;
            }
        },
    ];

    constructor(
        private usersService: RestUsersService,
        private toasterService: ToasterService,
        public dialog: MatDialog,
        private logger: LoggerService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
        const that = this;
        this.columns = [
            { caption: "User name", dataField: "username" },
            { caption: "Email", dataField: "email" },
            { caption: "Last name", dataField: "lastName" },
            { caption: "Company", dataField: "company.companyName" },
            { caption: "User type", dataField: "class" },

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
            case "Log user": {
                this.enableLogging(e.data.data);
                break;
            }
            default: {
                break;
            }
        }
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
        // TBD
        // this.hitlistSettingsService.saveState("user", this.dataGrid);
    }

    /**
     * Loading last saved table state
     * @param ev Grid component
     */
    loadState(ev) {
        // TBD
        // this.hitlistSettingsService.loadState("user", ev.component ? ev.component : this.dataGrid);
    }

    ngOnInit() {
        this.usersService.getUsersLayoutPreferences().then((data) => {
            this.prefs = data;
        });
    }

    loadData() {
        this.usersService.getUsers().then((data: any) => {
            this.dataGrid.setData(data[0]);
        }).catch(error => { this.logger.error(error); });
    }

    /**
     * TODO : split method
     * Dialog for user details - update or insert
     */
    private openUser() {
        const dialogRef = this.dialog.open(DialogUserComponent, {
            data: this.user
        });

        this.userSub = dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.usersService.saveUser(
                    result
                ).then(
                    (data) => {
                        if (result.id) {
                            this.dataGrid.updateRow(data);
                            this.toasterService.pop("info", "User updated", data.username + " successfully updated");
                        } else {
                            this.dataGrid.insertRow(data);
                            this.toasterService.pop("info", "User created", data.username + " successfully created");
                        }
                    })
                    .catch((error) => {
                        this.toasterService.pop("error", "Database error", error.error.message);
                        this.logger.error(error);
                    });
            }
            this.userSub.unsubscribe();
        });
    }

    private confirmDelete(id: number) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: "Are you sure to delete?" }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.usersService.delUser(id).then(
                    (data) => {
                        this.dataGrid.updateRow({ id });
                        this.toasterService.pop("info", "User deleted", "Successfully deleted");
                    }
                ).catch((error) => {
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
            this.usersService.getUser(id).then(
                (data) => {
                    data.password = "";
                    this.user = data;
                    this.openUser();
                })
                .catch((error) => {
                    this.user = {};
                });
        } else {
            this.user = { id: null, company: {} };
            this.openUser();
        }

    }

    public enableLogging(row) {
        let logging = true;
        if (this.prefs[row.id + "-" + row.company.id] && this.prefs[row.id + "-" + row.company.id].logging) {
            logging = !this.prefs[row.id + "-" + row.company.id].logging;
        }
        this.usersService.setLogging(row.id, row.company.id, logging);
        this.prefs[row.id + "-" + row.company.id].logging = logging;
    }

}
