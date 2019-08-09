import { Component, OnInit, Inject, ComponentFactoryResolver, Injector, ApplicationRef, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { HubFormsDialogComponent } from "../hub-forms-dialog/hub-forms-dialog.component";
import { HubFormsService } from "../hub-forms.service";
import { RestFormsService } from "../../rest/forms-rest.service";
import { ToasterService } from "angular2-toaster";
import { parseJsonMessage } from "@ra/web-shared-fe";
import { DataExchangeService } from "@ra/web-components";
import { DockableComponent, Dockable } from "@ra/web-components";
import { LoggerService, ConfirmDialogComponent } from "@ra/web-shared-fe";
import { Subscription } from "rxjs/internal/Subscription";
import { HubFormsTabComponent } from "../hub-forms-tab/hub-forms-tab.component";


@Dockable({
    tab: { component: HubFormsTabComponent },
    icon: "event_note",
    label: "All Rules"
})
@Component({
    selector: "ra-hub-forms-overview",
    templateUrl: "./hub-forms-overview.component.html",
    styleUrls: ["./hub-forms-overview.component.less"]
})
export class HubFormsOverviewComponent extends DockableComponent implements OnInit, OnDestroy {

    private tabSub: Subscription;
    private dataGrid;
    private data;

    public gridColumns: any[] = [];
    public currentKey;
    public rowClick;

    public typ: string;
    fields: any = [];
    users: any[] = [];

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

    public rowActionClick(e) {
        switch (e.action.label) {
            case "Update": {
                this.openDialog(e.data.data, "U");
                break;
            }
            case "Delete": {
                this.openDialog(e.data.data, "D");
                break;
            }
            default: {
                break;
            }
        }
    }

    constructor(
        public dialog: MatDialog,
        public hubFormsService: HubFormsService,
        public restFormsService: RestFormsService,
        public toasterService: ToasterService,
        private logger: LoggerService,
        public hubDataExchangeService: DataExchangeService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);

        const fields = [
            { caption: "Type", key: "dataType", type: "string" },
            { caption: "Name", key: "name", type: "string" },
            { caption: "Status", key: "status", type: "string" },
            {
                caption: "Accounts", key: "accounts", type: "externalList",
                templateOptions: { multiple: true, externalList: { valueExpr: "id", displayExpr: "name" } }
            },
            { caption: "Alert Message", key: "alertMessage", type: "string" },
            { caption: "Email Alert", key: "emailAlert", type: "string" },
            { caption: "Email Address", key: "emailAddress", type: "string" },
            { caption: "Triggered Count", key: "triggeredCount", type: "number" },
            { caption: "Created", key: "createDate", type: "datepicker" },
            { caption: "Created By", key: "createdBy", type: "string" },
            { caption: "Update By", key: "updatedBy", type: "string" }];
        this.hubFormsService.processFields(fields, this.gridColumns);
    }

    loadData() {
        this.restFormsService.getData(null, null, undefined).then(
            (result) => {
                if (result) {
                    parseJsonMessage(result, "data");
                    this.data = result;
                    this.dataGrid.setData(this.data);
                }
            }
        ).catch(error => { this.logger.error(error); });
    }

    public onInitialized(e) {
        this.dataGrid = e.compoment ? e.component : e;
        this.loadData();
        this.setTabData({ disableInsert: true });
    }

    private confirmDelete(data: any) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: "Are you sure to delete?" }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.restFormsService.deleteData(data).then(
                    () => {
                        this.dataGrid.updateRow({ id: data.id });
                        this.toasterService.pop("info", "Deleted", "Data succesfully deleted");
                        this.rowClick = null;
                        this.currentKey = null;
                    }
                ).catch((error) => {
                    this.logger.error(error);
                    this.toasterService.pop("error", "Database error", error.error.message);
                });

            }
        });
    }

    public openDialog(data, type) {
        if (type === "D") {
            this.confirmDelete(data);
            return;
        }

        this.hubFormsService.getFields(data.dataType).then((fields) => {
            this.fields = fields;


            let passData = {};
            if (type === "U") {
                passData = data;
            }
            const dialogRef = this.dialog.open(HubFormsDialogComponent, {
                maxHeight: "90vh",
                data: { fields: this.fields, model: { ...passData }, type: type }
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    result["dataType"] = data.dataType;
                    this.restFormsService.saveData(result).then((resp) => {
                        parseJsonMessage(resp, "data");
                        parseJsonMessage(resp, "wsResponse", "WS - ");

                        if (result.id) {
                            resp.id = result.id;
                            this.dataGrid.updateRow(resp);
                            this.toasterService.pop("info", "Saved", "Data succesfully updated");

                        } else {
                            this.dataGrid.insertRow(resp);
                            this.toasterService.pop("info", "Saved", "Data succesfully saved created");

                        }
                    });
                }
            });
        });
    }

    public onRowClick(e) {
        if (e.rowType !== "data") { return; }

        if (this.currentKey === e.key) {
            this.currentKey = null;
            this.rowClick = null;
        } else {
            this.currentKey = e.key;
            this.rowClick = e.data;
        }

        this.setTabData({ isChoosen: this.currentKey !== null });
    }

    ngOnInit() {
        this.tabSub = this.getTabResult().subscribe((data) => {
            if (data.action==="R") {
                this.loadData();
            }
        });
    }

    ngOnDestroy() {
        this.unsubscribe();
        if (this.tabSub) {
            this.tabSub.unsubscribe();
        }
    }
}
