import {
    OnInit, OnDestroy, Component, ViewChild, Input,
    AfterViewInit, EventEmitter, Output, Injector, ApplicationRef
} from "@angular/core";
import { OrderImportService } from "./order-import.service";
import { Subscription } from "rxjs/internal/Subscription";
import { NotifyService } from "../../core/notify/notify.service";
import { OrderGridComponent } from "../order-grid/order-grid.component";
import { MessageFactoryService } from "../message-factory.service";
import { Dockable } from "@ra/web-components";
import { DataExchangeService } from "@ra/web-components";
import { DropDownItem } from "@ra/web-shared-fe";
import { HttpClient } from "@angular/common/http";
import { OrderInitService } from "../../rest/order-init.service";
import { environment } from "../../../environments/environment";
import { RestPreferencesService } from "../../rest/rest-preferences.service";

@Dockable({
    label: "Import Order",
    icon: "cloud_upload",
    single: false
})
@Component({
    selector: "ra-order-import",
    templateUrl: "./order-import.component.html",
    styleUrls: ["./order-import.component.less"],
})
export class OrderImportComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild("file", { static: true }) file;

    @Output() sendMsg: EventEmitter<any> = new EventEmitter<any>();

    @Input() set repaintGrid(val) {
        if ((val) && (this.dataGrid)) {
            this.dataGrid.dxDataGrid.refresh();
        }
    }

    public orderColumns = [];
    public lists = {};
    public accounts = [];
    public rowColors: any;

    public dataGrid: OrderGridComponent;

    public inicialiazed = false;
    private importServiceSub: Subscription;

    private ordersToSend: { [key: number]: any } = {};

    public gridMenuItems: DropDownItem[] = [
        { toolTip: "butt.save.layout", icon: "send", label: "Save layout" },
        { toolTip: "butt.user.reload", icon: "replay", label: "Reload orders" },
    ];

    constructor(
        private orderImportService: OrderImportService,
        private toasterService: NotifyService,
        private restPreferencesService: RestPreferencesService,
        private messageFactoryService: MessageFactoryService,
        private orderInitService: OrderInitService,
        public hubDataExchangeService: DataExchangeService,
        private http: HttpClient,
    ) {
    }

    private setGridMenuItems() {
        this.gridMenuItems = [
            { toolTip: "butt.save.layout", icon: "send", label: "Save layout" },
            { toolTip: "butt.user.reload", icon: "replay", label: "Reload orders" },
        ];
        this.gridMenuItems.unshift(
            { toolTip: "butt.user.import", icon: "cloud_upload", label: "Import" });
        this.gridMenuItems.unshift(
            { toolTip: "butt.user.download", icon: "cloud_download", label: "Download example" });
    }

    public gridMenuItemClick(item: DropDownItem) {
        switch (item.icon) {
            case "send": {
                this.saveState();
                break;
            }
            case "replay": {
                this.initTable();
                break;
            }
            case "cloud_download": {
                this.downloadCsv();
                break;
            }
            case "cloud_upload": {
                this.uploadCsv();
                break;
            }
        }
    }

    public uploadCsv() {
        this.file.nativeElement.click();
    }

    private downloadFile(data: any) {
        const blob = new Blob([data], { type: "text/csv" });
        const element = document.createElement("a");
        element.href = URL.createObjectURL(blob);
        element.download = "example.csv";
        element.click();
    }

    public downloadCsv() {
        this.http.get("/assets/examples/import-example.csv", { responseType: "text" })
            .subscribe(data => {
                this.downloadFile(data);
            });
    }

    public importCsv(files: FileList) {
        this.orderImportService.insertCsvFile(files.item(0));
        this.file.nativeElement.value = "";
    }

    private checkImportedOrders() {
        const orders = this.orderImportService.getOrders();
        if (orders.length > 0) {
            this.initTable();
        }
    }


    public onGridInitialized(e) {
        this.dataGrid = e;
        const orders = this.orderImportService.getOrders();
        this.dataGrid.setData(orders);
        this.dataGrid.endCustomLoading();
    }

    get isSelected() {
        return Object.keys(this.ordersToSend).length > 0;
    }

    public initTable() {
        if (this.dataGrid) {
            this.dataGrid.beginCustomLoading("Loading...");
            const orders = this.orderImportService.getOrders();
            this.dataGrid.setData(orders);
            this.dataGrid.endCustomLoading();
        }
    }

    public cancel() {
        this.dataGrid.sourceControl.clearData();
        this.dataGrid.sourceControl.loadData();
        this.orderImportService.clearImports();
        this.dataGrid.refresh();
    }

    public send() {
        const orders = this.dataGrid.sourceControl.getData();
        orders.forEach((order) => {
            const message = this.messageFactoryService.newOrder(order);
            this.sendMsg.emit(message);
        });
        this.orderImportService.clearImports();
        this.dataGrid.setData([]);
        this.dataGrid.refresh();
    }

    public sendSelected() {
        const orders = this.dataGrid.sourceControl.getData();
        Object.values(this.ordersToSend).forEach((order) => {
            const message = this.messageFactoryService.newOrder(order);
            this.sendMsg.emit(message);
            for (let i = 0; i < orders.length; i++) {
                if (orders[i]) {
                    if (order.rowId === orders[i].rowId) {
                        this.orderImportService.RemoveImport(order);
                    }
                }
            }
        });
        this.ordersToSend = {};
        this.dataGrid.setData(this.orderImportService.getOrders());
        this.dataGrid.refresh();
        if (this.dataGrid.sourceControl.getData().length === 0) {
            this.orderImportService.clearImports();
        }
    }

    public removeSelected() {
        const orders = this.dataGrid.sourceControl.getData();
        Object.values(this.ordersToSend).forEach((order) => {
            for (let i = 0; i < orders.length; i++) {
                if (orders[i]) {
                    if (order.rowId === orders[i].rowId) {
                        this.orderImportService.RemoveImport(order);
                        this.toasterService.pop("info", "Removed", "Selected rows was removed", true);
                    }
                }
            }
        });
        this.ordersToSend = {};
        this.dataGrid.setData(this.orderImportService.getOrders());
        this.dataGrid.refresh();
        if (this.dataGrid.sourceControl.getData().length === 0) {
            this.orderImportService.clearImports();
        }
    }

    public rowCheck(data) {
        this.ordersToSend = data;
        this.orderImportService.setSelected(data);
    }

    rowClickEvent(event) {
        if ((event.rowType !== "data") || (!event.rowElement)) { return; }
        if (event.rowElement.classList.value.indexOf("highlightColor") > -1) {
            setTimeout(() => {
                event.rowElement.classList.remove("highlightColor");
                delete this.ordersToSend[event.data.rowId];
                this.orderImportService.RemoveSelectedImport(event.data);
            }, 0);
        } else {
            setTimeout(() => {
                event.rowElement.classList.add("highlightColor");
                this.ordersToSend[event.data.rowId] = event.data;
                this.orderImportService.addSelectedImport(event.data);
            }, 0);
        }
    }

    onRowPrepared(event) {
        if (event.rowType !== "data") { return; }

        if (this.ordersToSend[event.data.rowId]) {
            setTimeout(() => {
                event.rowElement.classList.add("highlightColor");
            }, 0);
        }
    }

    updated(evt) {
        if (this.ordersToSend[evt.key]) {
            Object.keys(evt.data).forEach((attrs) => {
                this.ordersToSend[evt.key][attrs] = evt.data[attrs];
            });
            this.orderImportService.UpdateSelectedImport(this.ordersToSend[evt.key]);
        }
    }

    // /**
    //  * Saving last table state
    //  */
    saveState() {
        this.dataGrid.saveState();
    }

    ngAfterViewInit(): void {
        this.importServiceSub = this.orderImportService.reloadDataNotify$.subscribe(() => {
            this.initTable();
        });
    }

    getOrderColumns() {
        const that = this;
        this.orderColumns = [];
        return this.restPreferencesService.getAppPref("order_store_columns").then((columns) => {
            for (let i = 0; i < columns.length; i++) {
                if ((columns[i].format) && (columns[i].format.precision)) {
                    columns[i].format.precision = environment.precision;
                }
                if (columns[i].lookup) {
                    columns[i].lookup = { "dataSource": this.lists[columns[i].dataField], "displayExpr": "name", "valueExpr": "value" };
                    columns[i].dataType = "lookup";
                }
                if (columns[i].lookup2) {
                    columns[i].lookup = { "dataSource": this.accounts, "displayExpr": "name", "valueExpr": "name" };
                    columns[i].dataType = "lookup";
                }
                // default columns editing for import
                if (columns[i].allowEditing === undefined) {
                    columns[i].allowEditing = true;
                }
                if (columns[i].templateCell) {
                    // we dont want this columns in import
                    // columns[i].cellTemplate = columns[i].templateCell;

                } else {
                    columns[i].calculateDisplayValue = function (data) {
                        return that.messageFactoryService.calculateDisplayValue(data, columns[i]);
                    };
                    this.orderColumns.push(columns[i]);
                }
            }
            //            this.orderColumns = columns;
            return this.orderColumns;
        });
    }

    ngOnInit(): void {
        this.initTable();
        this.ordersToSend = this.orderImportService.getSelected();
        this.setGridMenuItems();
        this.checkImportedOrders();

        this.orderInitService.getRowColors().then((data) => {
            this.rowColors = data;
            this.orderInitService.getLists().then((adata) => {
                this.lists = adata;
                this.getOrderColumns().then((bdata) => {
                    this.inicialiazed = true;
                });
            });
        });
    }

    ngOnDestroy() {
        if (this.importServiceSub) {
            this.importServiceSub.unsubscribe();
        }
    }
}
