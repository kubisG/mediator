import { Component, OnInit, Inject, ComponentFactoryResolver, Injector, ApplicationRef, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { HubFormsDialogComponent } from "../hub-forms-dialog/hub-forms-dialog.component";
import { HubFormsService } from "../hub-forms.service";
import { RestFormsService } from "../../rest/forms-rest.service";
import { ToasterService } from "angular2-toaster";
import { parseJsonMessage } from "@ra/web-shared-fe";
import { DataExchangeService } from "@ra/web-components";
import { DockableComponent, Dockable } from "@ra/web-components";
import { Subscription } from "rxjs/internal/Subscription";
import { HubFormsTabComponent } from "../hub-forms-tab/hub-forms-tab.component";
import { GoldenLayoutComponentState } from "@embedded-enterprises/ng6-golden-layout";
import { LoggerService, ConfirmDialogComponent } from "@ra/web-shared-fe";

@Dockable({
    tab: { component: HubFormsTabComponent },
    icon: "view_list",
    label: "List of Rules"
})
@Component({
    selector: "ra-hub-forms-grid",
    templateUrl: "./hub-forms-grid.component.html",
    styleUrls: ["./hub-forms-grid.component.less"]
})
export class HubFormsGridComponent extends DockableComponent implements OnInit, OnDestroy {

    private tabSub: Subscription;
    private dataGrid;
    private data;

    public gridColumns: any[] = [];
    public currentKey;
    public rowClick;

    public typ: string;
    private formName: string;
    fields: any = [];


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
        @Inject(GoldenLayoutComponentState) compstate: any,
        public hubDataExchangeService: DataExchangeService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);

        if (compstate.dataType) {
            this.typ = compstate.dataType;
            this.formName = compstate.label;
        }

        this.hubFormsService.getColumns(this.typ).then((cols) => { this.gridColumns = cols; });
        this.hubFormsService.getFields(this.typ).then((fields) => { this.fields = fields; });
    }

    loadData() {
        this.restFormsService.getData(null, null, this.typ).then(
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
                        this.hubDataExchangeService.pushData({ order: null, lists: this.fields }, ["ORDER"]);
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
        let passData = {};
        if (type === "U") {
            passData = data;
        }
        const dialogRef = this.dialog.open(HubFormsDialogComponent, {
            maxHeight: "90vh",
            minWidth: "60vw",
            data: {
                formName: this.formName ? this.formName : "Configuration"
                , fields: this.fields, model: { ...passData }, type: type
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                result["dataType"] = this.typ;
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
    }

    public onRowClick(e) {
        if (e.rowType !== "data") { return; }

        if (this.currentKey === e.key) {
            this.currentKey = null;
            this.rowClick = null;
        } else {
            this.currentKey = e.key;
            this.rowClick = e.data;

            if (this.rowClick && this.rowClick !== null) {
                this.hubDataExchangeService.pushData({ order: this.rowClick, lists: this.fields }, ["ORDER"]);
            }
        }

        this.setTabData({ isChoosen: this.currentKey !== null });
    }

    ngOnInit() {
        this.tabSub = this.getTabResult().subscribe((data) => {
            if (data.action === "R") {
                this.loadData();
            } else {
                this.openDialog(null, data.action);
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
