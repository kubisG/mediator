import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import DxDataGrid from "devextreme/ui/data_grid";
import { DataSourceControl } from "../../data-grid/data-source-control";
import { DataGridControl } from "../../data-grid/data-grid-control";
import { Subscription } from "rxjs/internal/Subscription";
import { DataGridService } from "../../data-grid/data-grid.service";
import { LoggerService } from "../../core/logger/logger.service";
import { NotifyService } from "../../core/notify/notify.service";
import { Side, OrdStatus } from "@ra/web-shared-fe";
import { UIDService } from "../../core/uid.service";
import { RowGraphComponent } from "../row-graph/row-graph.component";
import { environment } from "../../../environments/environment";
import { RowIconsComponent } from "../row-icons/row-icons.component";
@Component({
    selector: "ra-order-grid",
    templateUrl: "./order-grid-ag.component.html",
    styleUrls: ["./order-grid.component.less"],
})
export class OrderGridComponent implements OnInit, OnDestroy {
    @Input() key: string;

    @Input() set columns(data: any[]) {
        this._columns = this.transFormData(data);
    }
    get columns() {
        return this._columns;
    }

    @Input() set sumColumns(data: any[]) {
        this._sumColumns = this.transFormData(data);
    }
    get sumColumns() {
        return this._sumColumns;
    }

    @Input() gridStateKey: string;
    @Input() rowColors: any;
    @Input() rowEvent = true;
    @Input() editable = false;
    @Input() set rowActions(actions) {
        this.actions = actions;
    }
    @Input() set height(px) {
        this._height = px;
    }
    get height() {
        return this._height ? this._height : "auto";
    }

    public _columns: any[] = [];
    public _sumColumns: any[] = [];
    public isLoadPanelVisible = true;
    public myid;

    @Output() rowClick: EventEmitter<any> = new EventEmitter();
    @Output() rowPrepared: EventEmitter<any> = new EventEmitter();
    @Output() rowPushed: EventEmitter<any> = new EventEmitter();
    @Output() rowUpdated: EventEmitter<any> = new EventEmitter();
    @Output() rowInserted: EventEmitter<any> = new EventEmitter();
    @Output() initialized: EventEmitter<any> = new EventEmitter();
    @Output() rowAccept: EventEmitter<any> = new EventEmitter();
    @Output() rowReject: EventEmitter<any> = new EventEmitter();
    @Output() rowCheck: EventEmitter<any> = new EventEmitter();
    @Output() actionClick: EventEmitter<any> = new EventEmitter();
    @Output() changedRow: EventEmitter<any> = new EventEmitter();
    @Output() contentReady: EventEmitter<any> = new EventEmitter();

    public hideFilter = false;
    public dxDataGrid: DxDataGrid;
    public sourceControl: DataSourceControl;
    public gridControl: DataGridControl;
    public lastInserted: any;
    public insertSub: Subscription;
    public updateSub: Subscription;
    public removeSub: Subscription;
    public raId: any;
    public checkAll = false;
    public unCheckAll = false;
    public inicialized = false;
    public actions = [];
    private selectedRows = {};
    private data = [];
    private _height;
    private lastReceivedMessages: { [key: string]: any } = {};
    private filterButton;

    constructor(
        private cdRef: ChangeDetectorRef,
        private dataGridService: DataGridService,
        private logger: LoggerService,
        private toasterService: NotifyService,
        private random: UIDService
    ) {
        this.myid = this.random.nextInt();
    }

    public transFormData(data: any[]) {
        const that = this;
        for (let i = 0; i < data.length; i++) {
            if (data[i].dataType) {
                data[i].type = [];
                switch (data[i].dataType) {
                    case "date": {
                        data[i].type.push("dateColumn");
                        break;
                    }
                    case "number": {
                        data[i].type.push("numericColumn");
                        if ((!data[i].calculateDisplayValue) && (!data[i].valueFormatter)) {
                            data[i].valueFormatter = (values) => {
                                const val = values.value ? values.value : values;
                                if (isNaN(val)) {
                                    return null;
                                } else {
                                    return Number(val).toLocaleString(undefined, { minimumFractionDigits: environment.precision });
                                }
                            };
                        }
                        if (data[i].allowEditing) {
                            data[i].cellEditor = "number";
                            data[i].cellEditorParams = {
                                raType: "numeric",
                                raMin: 0,
                                raMax: 99999999,
                                raPrecision: data[i].format && data[i].format.precision ? data[i].format.precision : 0,
                            };
                            if (data[i].validation) {
                                data[i].cellEditorParams = {
                                    ...data[i].cellEditorParams,
                                    raMin: data[i].validation.min,
                                    raMax: data[i].validation.max,
                                    raRequired: data[i].validation.required,
                                };
                            }
                        }
                        break;
                    }
                    case "lookup2":
                    case "lookup": {
                        data[i].enableRowGroup = true;
                        if (data[i].allowEditing) {
                            data[i].cellEditor = "select";
                            data[i].cellEditorParams = {
                                raLookup: {
                                    dataSource: data[i].lookup.dataSource,
                                    displayExpr: data[i].lookup.displayExpr,
                                    valueExpr: data[i].lookup.valueExpr,
                                }
                            };
                        }
                        break;
                    }
                }
            }
            if (!data[i].calculateDisplayValue && data[i].format && data[i].format.type === "percent") {
                data[i].valueFormatter = (values) => {
                    const val = values.value ? values.value : values;
                    if (isNaN(val)) {
                        return null;
                    } else {
                        return (Number(val * 100)).toLocaleString(undefined, { minimumFractionDigits: environment.precision });
                    }
                };
            }
            if (data[i].fixed) {
                data[i].pinned = data[i].fixedPosition;
                data[i].lockPosition = true;
                data[i].lockVisible = true;
                data[i].lockPinned = true;
            }
            if (!data[i].showInColumnChooser) {
                data[i].lockVisible = true;
            }
            if (data[i].calculateDisplayValue) {
                data[i].valueFormatter = data[i].calculateDisplayValue;
            }
            if (data[i].customizeText) {
                data[i].valueFormatter = data[i].customizeText;
            }
            if (data[i].calculateCellValue) {
                data[i].valueGetter = data[i].calculateCellValue;
            }
            if (data[i].cellTemplate) {
                if (data[i].cellTemplate === "graph") {
                    data[i].cellRendererFramework = RowGraphComponent;
                    data[i].comparator = function (valueA, valueB, nodeA, nodeB, isInverted) {
                        let currentValueA = 0;
                        if (nodeA.data && nodeA.data.OrderQty && nodeA.data.OrderQty > 0) {
                            currentValueA = (Number(nodeA.data.CumQty ? nodeA.data.CumQty : 0) / Number(nodeA.data.OrderQty) * 100);
                        }
                        let currentValueB = 0;
                        if (nodeB.data && nodeB.data.OrderQty && nodeB.data.OrderQty > 0) {
                            currentValueB = (Number(nodeB.data.CumQty ? nodeB.data.CumQty : 0) / Number(nodeB.data.OrderQty) * 100);
                        }
                        return currentValueA - currentValueB;
                    };

                } else if (data[i].cellTemplate === "checkbox") {
                    data[i].headerCheckboxSelection = true;
                    data[i].checkboxSelection = true;
                    data[i].allowResizing = false;
                    data[i].cellClass = "ra-checkbox";
                } else if (data[i].cellTemplate === "actions") {
                    data[i].cellRendererFramework = RowIconsComponent;
                    data[i].allowSorting = false;
                    data[i].caption = "Flags";
                    data[i].allowResizing = true;
                    data[i].minWidth = null;
                    data[i].width = 80;
                }
            }
        }
        return data;
    }

    public onInitialized(e) {
        this.dxDataGrid = e.component ? e.component : e;
        this.gridControl.setDxDataGrid(this.dxDataGrid);
        this.initialized.emit(this);
    }

    public onSelected(rows) {
        this.rowCheck.emit(rows);
    }

    public onRowClick(e) {
        if ((!e.rowType) && (!e.key)) {
            e.rowType = "data";
        }
        e.key = e.key ? e.key : e.id;

        this.raId = e.key;
        if ((this.rowEvent) && this.dxDataGrid.getRowElement) {
            this.gridControl.rowClick(e);
        }
        this.rowClick.emit(e);
    }

    public onRowPrepared(item) {
        if (item.data) {
            if (item.data.sended === 1) {
                item.rowElement.classList.add("notsended");
            }
            if (item.data.Side === Side.Buy) {
                item.rowElement.style.color = "#19B5FE";
            } else {
                item.rowElement.style.color = "#f5475b";
            }

            if (this.rowEvent) {
                if (this.rowColors) {
                    item.rowElement.style.backgroundColor = this.rowColors[item.data.OrdStatus];
                    // if (this.rowColors[item.data.OrdStatus].lineThrough) {
                    //     item.rowElement.style.textDecoration = "line-through";
                    // }
                }

                if (item.data.RaID === this.raId) {
                    item.rowElement.classList.add("highlightColor");
                }
                if (this.lastInserted && this.lastInserted.RaID === item.data.RaID) {
                    this.changedRow.emit(item);
                    this.lastInserted = undefined;
                    delete this.lastReceivedMessages[item.data.RaID];
                }
            }
        }
        this.rowPrepared.emit(item);
    }

    public saveEditData(): Promise<any> {
        return this.dxDataGrid.saveEditData();
    }

    onToolbarPreparing(e) {
        const that = this;
        e.toolbarOptions.items.unshift({
            location: "after",
            widget: "dxButton",
            options: {
                icon: "find",
                hint: "Switch filter",
                onClick: this.hideFilters.bind(this),
                onInitialized: function (but) {
                    that.filterButton = but.component;
                }
            }
        });
    }

    hideFilters() {
        this.hideFilter = !this.hideFilter;
        // const columnCount = this.dxDataGrid.columnCount();

        // for (let i = 0; i < columnCount; i++) {
        //     if (!this.dxDataGrid.columnOption(i, "filterValues")) {
        //         this.dxDataGrid.columnOption(i, "allowHeaderFiltering", this.hideFilter);
        //     }
        // }
        // if (this.hideFilter) {
        //     this.filterButton.option("icon", "expand");
        //     this.dxDataGrid.clearFilter();
        // } else {
        //     this.filterButton.option("icon", "collapse");
        // }
        this.dxDataGrid.option("headerFilter.visible", !this.hideFilter);
    }

    public buttonClick(event) {
        this.actionClick.emit(event);
    }

    public onRowInserted(item) {
        this.rowInserted.emit(item);
    }


    public onRowUpdated(item) {
        this.rowUpdated.emit(item);
    }

    public setData(data: any[], loadstate: boolean = true): Promise<any> {
        this.sourceControl.setData(data);
        this.data = data;
        try {
            (this.dxDataGrid as any).setData(data);
        } catch (ex) {
            console.log(ex);
        }
        if (loadstate) {
            return this.loadState(this.gridStateKey).then((state) => {

            });
        } else {
            return Promise.resolve();
        }
    }

    public setSumRow(data) {
        try {
            (this.dxDataGrid as any).setSumData(data);
        } catch (ex) {
            console.log(ex);
        }
    }

    public insertRow(row: any) {
        this.sourceControl.insert(row);
        this.lastInserted = row;
        this.lastReceivedMessages[row.RaID] = row;
        try {
            (this.dxDataGrid as any).insertRow(row);
        } catch (ex) {
            console.log(ex);
        }
    }

    public updateRow(row: any) {
        this.sourceControl.update(row[this.key], row);
        this.lastInserted = row;
        this.lastReceivedMessages[row.RaID] = row;
        try {
            (this.dxDataGrid as any).updateRow(row);
        } catch (ex) {
            console.log(ex);
        }
    }

    public refresh(): Promise<any> {
        return this.dxDataGrid.refresh(true);
    }

    public pushRow(row: any): Promise<{ type: string }> {
        return new Promise((resolve, reject) => {
            this.sourceControl.getRowByKey(`${row[this.key]}`).then((data) => {
                this.updateRow(row);
                resolve({ type: "info" });
            }).catch((err) => {
                this.insertRow(row);
                resolve({ type: "success" });
            });
        });
    }

    public columnOption(id: number | string, optionName: string, optionValue: any) {
        this.dxDataGrid.columnOption(id, optionName, optionValue);
    }

    public loadState(gridStateKey?: string) {
        return this.gridControl.loadState(gridStateKey ? gridStateKey : this.gridStateKey).then((data) => {
            this.sourceControl.setData(this.data);
            return data;
        });
    }

    public saveState() {
        this.gridControl.saveState(this.gridStateKey).then(
            (data) => {
                this.toasterService.pop("info", "Settings", "Table settings successfully saved");
            })
            .catch(error => {
                this.logger.error(error);
                this.toasterService.pop("error", "Database error", error.message);
            });
    }

    public rowAcceptClick(event) {
        this.rowAccept.emit(event);
    }

    public rowRejectClick(event) {
        this.rowReject.emit(event);
    }

    public rowCheckEvent(event) {
        this.checkAll = false;
        this.unCheckAll = false;
        this.selectedRows[event.key] = event.data;
        this.rowCheck.emit(Object.values(this.selectedRows));
    }

    public rowUnCheckEvent(event) {
        this.checkAll = false;
        this.unCheckAll = false;
        delete this.selectedRows[event.key];
        this.rowCheck.emit(Object.values(this.selectedRows));
    }

    public rowCheckAllEvent(event) {
        const instance = this;
        this.checkAll = true;
        this.unCheckAll = false;
        this.sourceControl.getData().forEach((row) => {
            this.selectedRows[row[instance.key]] = row;
        });
        this.rowCheck.emit(Object.values(this.selectedRows));
    }

    public rowUnCheckAllEvent(event) {
        this.unCheckAll = true;
        this.checkAll = false;
        this.selectedRows = {};
        try {
            (this.dxDataGrid as any).checkRows();
        } catch (ex) {
            console.log(ex);
        }
        this.rowCheck.emit(Object.values(this.selectedRows));
    }

    public beginCustomLoading(text: string) {
        this.isLoadPanelVisible = true;
        try {
            (this.dxDataGrid as any).beginCustomLoading();
        } catch (ex) {
            console.log(ex);
        }
    }

    public endCustomLoading() {
        this.isLoadPanelVisible = false;
        try {
            (this.dxDataGrid as any).endCustomLoading();
        } catch (ex) {
            console.log(ex);
        }
        this.cdRef.detectChanges();
    }

    public clearData() {
        this.sourceControl.clearData();
        try {
            (this.dxDataGrid as any).setData([]);
        } catch (ex) {
            console.log(ex);
        }
    }

    public filter(filter: any) {
        console.log("filter", filter);
        this.dxDataGrid.filter(filter);
    }

    public clearFilter() {
        this.dxDataGrid.clearFilter();
    }

    public getData() {
        return this.sourceControl ? this.sourceControl.dataSource.store()._array : undefined;
    }

    // dragLeaveHandler(e: any, val: any) {
    //     e.refresh();
    // }

    public onContentReady(event) {
        this.inicialized = true;
        this.contentReady.emit(event);
    }

    public ngOnInit(): void {
        this.gridControl = this.dataGridService.create(this.key, []);
        this.sourceControl = this.gridControl.getSourceControl();
        this.insertSub = this.sourceControl.insertSubject$.subscribe((data) => {
            this.rowPushed.emit({ type: "insert", data });
        });
        this.updateSub = this.sourceControl.updateSubject$.subscribe((data) => {
            this.rowPushed.emit({ type: "update", data });
        });
        this.removeSub = this.sourceControl.removeSubject$.subscribe((data) => {
            this.rowPushed.emit({ type: "remove", data });
        });
    }

    public ngOnDestroy(): void {
        if (this.insertSub) {
            this.insertSub.unsubscribe();
        }
        if (this.updateSub) {
            this.updateSub.unsubscribe();
        }
        if (this.removeSub) {
            this.removeSub.unsubscribe();
        }
    }
}
