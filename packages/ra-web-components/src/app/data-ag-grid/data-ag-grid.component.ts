import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from "@angular/core";
import { GridOptions, RowNode, RowNodeTransaction } from "ag-grid-community";
import { DataGridInterface } from "../data-grid/data-grid-interface";
import "ag-grid-enterprise";
import { GridColumn } from "../data-grid/interfaces/grid-column.interface";
import { HeaderColumnComponent } from "./header-column/header-column.component";
import { HeaderComp, IHeaderParams } from "ag-grid-community/dist/lib/headerRendering/header/headerComp";
import * as _ from "lodash";
import { Side } from "@ra/web-shared-fe";
import { SelectEditorComponent } from "./select-editor/select-editor.component";
import { NumberEditorComponent } from "./number-editor/number-editor.component";

@Component({
    selector: "ra-data-ag-grid",
    templateUrl: "./data-ag-grid.component.html",
    styleUrls: ["./data-ag-grid.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAgGridComponent implements DataGridInterface, OnInit {

    static funcs: string[] = ["avg", "sum", "min", "max", "average"];

    private gridValidators: any[] = [];
    private init = true;
    private filtered = false;
    private filter = {
        column: null,
        value: null
    };

    public aggFuncs = {};

    public frameworkComponents = { agColumnHeader: HeaderColumnComponent };

    public gridOptions: GridOptions;
    public data: any[] = [];
    public updateData: any[] = [];
    public columns: any[];
    public rowColors = {};
    public rowActions = [];
    public gridState;
    public editable;

    @Output() initialized: EventEmitter<any> = new EventEmitter();
    @Output() selected: EventEmitter<any> = new EventEmitter();
    @Output() rowSelected: EventEmitter<any> = new EventEmitter();
    @Output() buttonClick: EventEmitter<any> = new EventEmitter();


    @Input() set colors(data) {
        this.rowColors = data;
    }

    @Input() set initData(data: any[]) {
        this.data = data ? data : [];
        this.setInitData();
        this.cd.markForCheck();
    }

    @Input() set update(data: any[]) {
        if (this.init === true) {
            this.data = data ? data : [];
            this.init = false;
            this.setInitData();
        } else {
            this.updateData = data ? data : [];
            this.updateGrid();
            this.cd.markForCheck();
        }
    }

    @Input() set initColumns(columns: GridColumn[]) {
        console.log(columns);
        if (!columns) {
            return;
        }
        this.setColumns(columns);
        this.setupGrid();
        this.cd.markForCheck();
    }

    @Input() set sumColumns(columns: GridColumn[]) {
        console.log(columns);
        if (!columns) {
            return;
        }
        this.setSumColumns(columns);
        this.cd.markForCheck();
    }

    @Input() gridKey: string;

    @Input() set gridEditable(data: any) {
        this.editable = data;
    }

    constructor(
        private cd: ChangeDetectorRef,
    ) {
        this.overrideHeaderCompInit();
    }

    static exists(value: any, allowEmptyString: boolean = false): boolean {
        return value != null && (value !== "" || allowEmptyString);
    }

    static firstExistingValue<A>(...values: A[]): A | null {
        for (let i = 0; i < values.length; i++) {
            const value: A = values[i];
            if (DataAgGridComponent.exists(value)) {
                return value;
            }
        }
        return null;
    }

    static getHeaderName(name: string) {
        if (name.indexOf("(") > -1) {
            const splited = name.split("(");
            if (DataAgGridComponent.funcs.indexOf(splited[0]) > -1) {
                return name.substring(name.indexOf("(") + 1, name.length - 1);
            }
        }
        return name;
    }

    private overrideHeaderCompInit() {
        HeaderComp.prototype.init = function (params: IHeaderParams) {
            const instance = (this as any);
            let template: string = DataAgGridComponent.firstExistingValue(
                params.template,
                (HeaderComp as any).TEMPLATE
            );
            // take account of any newlines & whitespace before/after the actual template
            template = template && template.trim ? template.trim() : template;
            instance.setTemplate(template);
            instance.params = params;
            instance.setupTap();
            instance.setupIcons(params.column);
            instance.setupMenu();
            instance.setupSort();
            instance.setupFilterIcon();
            instance.setupText(DataAgGridComponent.getHeaderName(params.displayName));
        };
    }

    private setColumns(columns: GridColumn[]) {
        const cls = [];
        columns.forEach((column) => {
            if (column.raValidators) {
                this.gridValidators[column.dataField] = column.raValidators;
            }
            cls.push({
                headerName: column.caption ? column.caption : column.dataField,
                field: column.dataField,
                enableRowGroup: column.enableRowGroup,
                rowGroup: column.rowGroup,
                hide: column.enableRowGroup && column.rowGroup,
                enableValue: true,
                allowedAggFuncs: column.aggFunc ? DataAgGridComponent.funcs : undefined,
                aggFunc: column.aggFunc,
                sort: column.sort,
                sortable: (column.allowSorting || column.allowSorting === undefined) ? true : false,
                resizable: (column.allowResizing || column.allowResizing === undefined) ? true : false,
                filter: (column.allowHeaderFiltering || column.allowHeaderFiltering === undefined) ? true : false,
                editable: column.allowEditing,
                type: column.type,
                width: column.width,
                pinned: column.pinned,
                lockPosition: column.lockPosition,
                lockVisible: column.lockVisible,
                lockPinned: column.lockPinned,
                valueFormatter: column.valueFormatter,
                cellEditorFramework: column.cellEditor === "select" ? SelectEditorComponent :
                    (column.cellEditor === "number" ? NumberEditorComponent : null),
                cellEditorParams: column.cellEditorParams,
                valueParser: column.valueParser,
                valueGetter: column.valueGetter,
                cellRendererFramework: column.cellRendererFramework,
                comparator: column.comparator,
                headerCheckboxSelection: column.headerCheckboxSelection,
                checkboxSelection: column.checkboxSelection,
                cellClass: column.cellClass,
                cellStyle: column.cellStyle ? column.cellStyle : (column.allowEditing ? ((item) => {
                    if ((typeof column.allowEditing === "function") && (!column.allowEditing(item))) {
                        return {};
                    } else {
                        return { color: "white", backgroundColor: "rgba(255,152,0,0.5) !important" };
                    }
                }) : (column.type && column.type.length > 0
                    && column.type.indexOf("numericColumn") > -1 ? { "text-align": "right" } : null)),
            });
        });
        this.columns = cls;
    }

    private setSumColumns(columns) {
        console.log(columns);
    }

    private getRowNodeId() {
        return (data) => {
            return data[this.gridKey];
        };
    }

    private onGridReady() {
        return () => {
            if (this.gridOptions.api && this.columns) {
                this.gridOptions.api.setDomLayout(`normal`);
                this.gridOptions.api.setAlwaysShowVerticalScroll(true);
                if (this.data.length > 0) {
                    console.log("data set 1");
                    this.gridOptions.api.setRowData(this.data);
                    this.data = [];
                }
                if (this.gridState) {
                    this.setState(this.gridState);
                }
            }
            this.initialized.emit(true);
        };
    }

    private isGridInitialized() {
        if (!this.gridOptions || !this.gridOptions.api) {
            return false;
        }
        return true;
    }

    private setInitData() {
        if (this.gridOptions.api.getDisplayedRowCount() === 0 && this.data.length > 0) {
            console.log("data set 2");
            this.gridOptions.api.setRowData(this.data);
            this.data = [];
            this.init = false;
            return true;
        }
        return false;
    }

    private inserRow(insertRow: any, rowNode: RowNode) {
        if (!rowNode) {
            this.gridOptions.api.updateRowData({ add: [insertRow] });
            return true;
        }
        return false;
    }

    getData() {
        const rowData = [];
        this.gridOptions.api.forEachNode((node) => { console.log("getdata", node); rowData.push(node.data); });
        return rowData;
    }

    private deleteRow(deleteRow: any, rowNode: RowNode) {
        const keys = Object.keys(deleteRow);
        if (rowNode && keys.length === 1 && keys[0] === this.gridKey) {
            this.gridOptions.api.updateRowData({ remove: [deleteRow] });
            return true;
        }
        return false;
    }

    private updateRow(updateRow: any, rowNode: RowNode) {
        const data = rowNode.data;
        for (const key of Object.keys(updateRow)) {
            data[key] = updateRow[key];
        }
        this.gridOptions.api.batchUpdateRowData({ update: [data] });
        if (this.gridOptions.enableCellChangeFlash) {
            this.gridOptions.api.flashCells({
                rowNodes: [rowNode]
            });
        }
        this.gridOptions.api.refreshCells({
            rowNodes: [rowNode],
            columns: ["ProgressBar"],
            force: true
        });
        return true;
    }

    public onSelectionChanged() {
        const selectedRows = this.gridOptions.api.getSelectedRows();
        this.selected.next(selectedRows);
    }

    public onRowSelected(event) {
        if (event.node.selected) {
            this.rowSelected.next(event.node);
        }
    }

    public reset(): void {
        if (this.gridOptions && this.gridOptions.api) {
            console.log("data set 3");
            // this.gridOptions.api.setRowData([]);
            this.gridOptions.api.setColumnDefs([]);
        }
    }

    private isFiltered() {
        return this.filtered;
    }

    private checkFilter(node): boolean {
        if (this.filter.column) {
            return node.data[this.filter.column] === this.filter.value;
        } else {
            return true;
        }
    }

    public setFilter(data?) {
        if (data && data.length > 0) {
            if (data[0][1] === "=") {
                this.filter.column = data[0][0];
                this.filter.value = data[0][2];
                this.filtered = true;
                this.gridOptions.api.onFilterChanged();
                return;
            }
        }
        this.filtered = false;
        this.filter.column = null;
        this.filter.value = null;
    }

    public groupRowAggNodes(nodes) {
        // console.log(nodes);
    }

    public updateGrid() {
        if (!this.isGridInitialized()) {
            return;
        }
        if (this.setInitData()) {
            return;
        }

        const updates = this.updateData;
        this.updateData = [];
        for (const update of updates) {
            const rowNode: RowNode = this.gridOptions.api.getRowNode(update[this.gridKey]);
            if (this.deleteRow(update, rowNode)) {
                continue;
            }
            if (this.inserRow(update, rowNode)) {
                continue;
            }
            this.updateRow(update, rowNode);
        }
    }

    public setupGrid() {
        if (this.gridOptions && this.gridOptions.api) {
            this.gridOptions.api.setColumnDefs(this.columns);
            this.gridOptions.getRowNodeId = this.getRowNodeId();
            this.gridOptions.onGridReady = this.onGridReady();
            this.gridOptions.isExternalFilterPresent = () => this.isFiltered();
            this.gridOptions.stopEditingWhenGridLosesFocus = true;
            this.gridOptions.doesExternalFilterPass = (param) => this.checkFilter(param);
            if (this.data && this.data.length > 0) {
                //  this.gridOptions.api.setRowData(this.data);
                console.log("seting data after init");
            }
            if (this.gridState) {
                console.log("seting grid after init");
                this.setState(this.gridState);
            }
            return;
        }
        console.log("setup", this);

        this.gridOptions = {
            enableRangeSelection: true,
            enableSorting: true,
            enableFilter: true,
            enableCellChangeFlash: false,
            stopEditingWhenGridLosesFocus: true,
            isExternalFilterPresent: () => this.isFiltered(),
            doesExternalFilterPass: (param) => this.checkFilter(param),
            columnDefs: this.columns,
            getRowNodeId: this.getRowNodeId(),
            onGridReady: this.onGridReady(),
            rowSelection: "multiple",
            onFirstDataRendered(params) { },
            //    frameworkComponents: this.frameworkComponents,
            columnTypes: {
                dateColumn: {
                    filter: "agDateColumnFilter", suppressMenu: true
                }
            },
            getRowStyle: (params) => {
                let txtColor = "";
                let txtDecor = "";
                if (params.data && params.data.Side === Side.Buy) {
                    txtColor = "#19B5FE";
                } else if (params.data && params.data.Side) {
                    txtColor = "#f5475b";
                }
                if (params.data && (params.data["Canceled"]) && (params.data["Canceled"] === "Y")) {
                    txtDecor = "line-through";
                }
                if (this.rowColors && params.data && this.rowColors[params.data.OrdStatus]) {
                    return {
                        background: this.rowColors[params.data.OrdStatus],
                        color: txtColor, "text-decoration": txtDecor
                    };
                } else {
                    return { color: txtColor, "text-decoration": txtDecor };
                }
            },
            context: {
                componentParent: this
            }
        };
        this.gridOptions.onRowGroupOpened = (event) => {

        };
    }

    public ngOnInit(): void {
    }

    public getState(): any {
        if (this.gridOptions) {
            const tableOptions = {
                colState: this.gridOptions.columnApi.getColumnState(),
                colGroupState: this.gridOptions.columnApi.getColumnGroupState(),
                sortState: this.gridOptions.api.getSortModel(),
                filterState: this.gridOptions.api.getFilterModel(),
            };
            return tableOptions;
        } else {
            return null;
        }
    }

    public setState(state: any): Promise<any> {
        this.gridState = state;
        if (this.gridState.colState) {
            this.gridOptions.columnApi.setColumnState(this.gridState.colState);
            this.gridOptions.columnApi.setColumnGroupState(this.gridState.colGroupState);
            this.gridOptions.api.setSortModel(this.gridState.sortState);
            this.gridOptions.api.setFilterModel(this.gridState.filterState);
        }
        return Promise.resolve();
    }

    public setColOption(id, option, value) {
        for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i].field === id) {
                this.columns[i][option] = value;
                break;
            }
        }
    }

    public saveEditData(): Promise<any> {
        const result = [];

        // all rows
        this.gridOptions.api.forEachNode((node) => {
            // all validators on columns
            if ((node.data) && result.length < 5) {
                for (const key of Object.keys(this.gridValidators)) {
                    for (const validator of this.gridValidators[key]) {
                        node["value"] = node.data[key];
                        if (validator.required && !node["value"]) {
                            result.push({
                                level: validator.level ? validator.level : "CRITICAL",
                                col: key,
                                val: node["value"],
                                message: validator.message ? validator.message : "Field " + key + " is required"
                            });
                            continue;
                        }
                        if (validator.valid && !validator.valid(node)) {
                            result.push({
                                level: validator.level,
                                col: key,
                                val: node["value"],
                                message: validator.message
                            });
                        }
                        if (result.length > 4) {
                            break;
                        }
                    }
                    if (result.length > 4) {
                        break;
                    }
                }
            }
        });

        return Promise.resolve(result);
    }

    public beginCustomLoading(info) {
        console.log("show overlay", info);
        this.gridOptions.api.showLoadingOverlay();
    }

    public endCustomLoading() {
        console.log("hide overlay", this);
        this.gridOptions.api.hideOverlay();
    }

    public checkRows(data) {
        if (!data) {
            this.gridOptions.api.deselectAll();
        }
    }

    public setData(data: any[]) {
        this.data = data;
        if ((this.gridOptions) && (this.gridOptions.api)) {
            this.gridOptions.api.setRowData(this.data);
            this.gridOptions.api.redrawRows();
        }
        this.init = false;
        this.cd.markForCheck();
    }

    public setSumData(data) {
        if ((this.gridOptions) && (this.gridOptions.api)) {
            data["raType"] = "sumRow";
            this.gridOptions.api.setPinnedBottomRowData([data]);
        }
        this.cd.markForCheck();
    }

    public addEmptyRow(id): any {
        const newItem = {};
        newItem[this.gridKey] = id;
        const res = this.gridOptions.api.updateRowData({ add: [newItem] });
        return res;
    }

    public removeRow(data): any {
        const res = this.gridOptions.api.updateRowData({ remove: [data] });
        return res;
    }

    public refresh() {
        console.log("refresh", this);

        // this.gridOptions.api.redrawRows();
        this.cd.markForCheck();
    }

    private createIcon(ico) {
        return "<img border='0' width='15' height='10' src='assets/img/" + ico + ".svg'/>";
    }

    public getContextMenuItems(params) {
        const that = params.context.componentParent;
        const menu = [];
        const status = [];
        if (params.node) {
            for (let i = 0; i < that.rowActions.length; i++) {
                let css = that.rowActions[i].color && that.rowActions[i].color(params.node) ? "font-red" : "";
                const disable = !that.rowActions[i].visible(params.node);

                if (that.rowActions[i].display === undefined) {
                    menu.push(
                        {
                            name: that.rowActions[i].label,
                            action: () => {
                                that.buttonClick.emit({ action: that.rowActions[i], data: params.node });
                            },
                            icon: that.createIcon(that.rowActions[i].icon),
                            cssClasses: [css],
                            disabled: disable
                        },
                    );

                } else {
                    if (that.rowActions[i].display(params.node) === true) {
                        css = css + (that.rowActions[i].display(params.node) === true ? " font-cursive" : "");
                        status.push(
                            {
                                name: that.rowActions[i].label,
                                icon: that.createIcon(that.rowActions[i].icon),
                                cssClasses: [css],
                                disabled: disable
                            },
                        );
                    }
                }
            }
        }

        const result = [
            {
                name: "Actions",
                subMenu: menu
            },
            ...status,
            "separator",
            "copy",
            "copyWithHeaders",
            "paste",
            "separator",
            "resetColumns",
            "export",
        ];
        return result;
    }
}
