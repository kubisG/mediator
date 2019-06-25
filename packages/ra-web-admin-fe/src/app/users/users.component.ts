import { Component, OnInit, ViewChild, ComponentFactoryResolver, Injector, ApplicationRef } from "@angular/core";
import { MatDialog } from "@angular/material";

import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";

import { DialogUserComponent } from "./dialog-user/dialog-user.component";
import { RestUsersService } from "../rest/rest-users.service";
import { DxDataGridComponent } from "devextreme-angular/ui/data-grid";
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
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    public dataSource: any = {};
    public dataStore: any = {};
    public collapsed: boolean;
    public apps: any[] = [
        { id: 0, label: "Trader&Broker" },
        { id: 1, label: "Trader" },
        { id: 2, label: "Broker" }
    ];

    private dataArray: any = [{}];
    private userSub;
    private user = {};
    private prefs = {};

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

    }

    ngOnInit() {
        this.usersService.getUsersLayoutPreferences().then((data) => {
            this.prefs = data;
        });
        this.usersService.getUsers().then((data: any) => {
            this.dataArray = data[0];
            this.dataStore = new ArrayStore({
                key: "id",
                data: this.dataArray
            });
            this.dataSource = new DataSource({
                store: this.dataStore,
            });
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
                            this.dataSource.store().update(result.id, data).then((a) => {
                                this.dataSource.reload();
                                this.toasterService.pop("info", "User updated", data.username + " successfully updated");
                            });
                        } else {
                            this.dataSource.store().insert(data).then((a) => {
                                this.dataSource.reload();
                                this.toasterService.pop("info", "User created", data.username + " successfully created");
                            });
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
                        this.dataSource.store().byKey(id).then(
                            (dataItem) => {
                                const removeRes = dataItem;
                                this.dataSource.store().remove(id).then((a) => {
                                    this.toasterService.pop("info", "User deleted", removeRes.username + " successfully deleted");
                                    this.dataSource.reload();
                                });
                            },
                            (error) => { this.logger.error(error); }
                        );
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
            this.user = { id: null, company: {}, currentBalance: {}, openBalance: {} };
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
