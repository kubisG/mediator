import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { GridOptions, RowNode } from "ag-grid-community";
import { DataGridInterface } from "../data-grid/data-grid-interface";
import "ag-grid-enterprise";
import { GridColumn } from "../data-grid/interfaces/grid-column.interface";
import { HeaderColumnComponent } from "./header-column/header-column.component";
import { HeaderComp, IHeaderParams } from "ag-grid-community/dist/lib/headerRendering/header/headerComp";
import * as _ from "lodash";
@Component({
    selector: "ra-data-ag-grid",
    templateUrl: "./data-ag-grid.component.html",
    styleUrls: ["./data-ag-grid.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAgGridComponent implements DataGridInterface, OnInit {

    public aggFuncs = {
        average: (values) => {
            return 123;
        },
    };

    public frameworkComponents = { agColumnHeader: HeaderColumnComponent };

    public gridOptions: GridOptions;
    public data: any[] = [];
    public updateData: any[] = [];
    public columns: any[];

    @Input() set initData(data: any[]) {
        this.data = data ? data : [];
        this.cd.markForCheck();
    }

    @Input() set update(data: any[]) {
        this.updateData = data ? data : [];
        this.updateGrid();
        this.cd.markForCheck();
    }

    @Input() set initColumns(columns: GridColumn[]) {
        if (!columns) {
            return;
        }
        this.setColumns(columns);
        this.setupGrid();
        this.cd.markForCheck();
    }

    @Input() gridKey: string;

    static exists(value: any, allowEmptyString: boolean = false): boolean {
        return value != null && (value !== '' || allowEmptyString);
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

    constructor(
        private cd: ChangeDetectorRef,
    ) {
        this.overrideHeaderCompInit();
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
            let name = params.displayName;
            if (params.displayName.indexOf("(") > -1) {
                name = params.displayName.substring((params.displayName.indexOf("(") + 1), params.displayName.length - 1);
            }
            instance.setupText(name);
        };
    }

    private setColumns(columns: any[]) {
        const cls = [];
        columns.forEach((column) => {
            cls.push({
                headerName: column.dataField,
                field: column.dataField,
                enableRowGroup: column.enableRowGroup,
                rowGroup: column.rowGroup,
                hide: column.enableRowGroup && column.rowGroup,
                enableValue: true,
                allowedAggFuncs: column.aggFunc ? ["avg", "sum", "min", "max", "average"] : undefined,
                aggFunc: column.aggFunc,
                sortable: true,
                resizable: true
            });
        });
        this.columns = cls;
    }

    private getRowNodeId() {
        return (data) => {
            return data[this.gridKey];
        };
    }

    private setRowData(data: any[]) {
        const buff: any[] = [];
        for (const row of data) {
            if (buff.indexOf(row[this.gridKey]) > -1) {
                this.gridOptions.api.batchUpdateRowData({ add: [row] });
                buff.push(row[this.gridKey]);
            } else {
                this.gridOptions.api.batchUpdateRowData({ update: [row] });
            }
        }
    }

    private onGridReady() {
        return () => {
            if (this.gridOptions.api && this.columns) {
                this.gridOptions.api.setDomLayout(`normal`);
                this.gridOptions.api.setAlwaysShowVerticalScroll(true);
                if (this.data.length > 0) {
                    this.setRowData(this.data);
                    this.data = [];
                }
                this.gridOptions.getRowStyle = (params) => {
                    if (params.data && params.data["Messages"] > 50) {
                        return { background: "#9ec3ff" };
                    }
                    return { background: "#faffb8" };
                };
            }
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
            this.setRowData(this.data);
            this.data = [];
            return true;
        }
        return false;
    }

    private inserRow(insertRow: any, rowNode: RowNode) {
        if (!rowNode) {
            this.gridOptions.api.batchUpdateRowData({ add: [insertRow] });
            return true;
        }
        return false;
    }

    private deleteRow(deleteRow: any, rowNode: RowNode) {
        const keys = Object.keys(deleteRow);
        if (rowNode && keys.length === 1 && keys[0] === this.gridKey) {
            this.gridOptions.api.batchUpdateRowData({ remove: [deleteRow] });
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
        return true;
    }

    reset(): void {
        if (this.gridOptions && this.gridOptions.api) {
            this.gridOptions.api.setRowData([]);
            this.gridOptions.api.setColumnDefs([]);
        }
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
            return;
        }
        this.gridOptions = {
            enableRangeSelection: true,
            columnDefs: this.columns,
            getRowNodeId: this.getRowNodeId(),
            onGridReady: this.onGridReady(),
            onFirstDataRendered(params) {
                // params.api.sizeColumnsToFit();
            }
        };
        this.gridOptions.onRowGroupOpened = (event) => {

        };
    }

    public ngOnInit(): void {

    }

}
