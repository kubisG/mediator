import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { GridOptions, RowNode } from "ag-grid-community";
import { DataGridInterface } from "../data-grid/data-grid-interface";
import "ag-grid-enterprise";

@Component({
    selector: "ra-data-ag-grid",
    templateUrl: "./data-ag-grid.component.html",
    styleUrls: ["./data-ag-grid.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAgGridComponent implements DataGridInterface, OnInit {

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

    @Input() set initColumns(columns: any[]) {
        if (!columns) {
            return;
        }
        this.setColumns(columns);
        this.setupGrid();
        this.cd.markForCheck();
    }

    @Input() gridKey: string;

    constructor(
        private cd: ChangeDetectorRef,
    ) { }

    private setColumns(columns: any[]) {
        const cls = [];
        columns.forEach((column) => {
            if (column.dataField === "A" || column.dataField === "D") {
                cls.push({
                    headerName: column.dataField,
                    field: column.dataField,
                    enableRowGroup: true,
                    allowedAggFuncs: ["sum", "min", "max"],
                    aggFunc: "sum",
                    enableValue: true,
                });
            } else {
                cls.push({
                    headerName: column.dataField,
                    field: column.dataField,
                    enableRowGroup: true,
                    enableValue: true,
                });
            }
        });
        this.columns = cls;
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
                    this.gridOptions.api.setRowData(this.data);
                }
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
            this.gridOptions.api.setRowData(this.data);
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

    private deleteRow(deleteRow: any, rowNode: RowNode) {
        const keys = Object.keys(deleteRow);
        if (rowNode && keys.length === 1 && keys[0] === this.gridKey) {
            this.gridOptions.api.updateRowData({ remove: [deleteRow] });
            return true;
        }
        return false;
    }

    private updateRow(updateRow: any, rowNode: RowNode) {
        for (const key of Object.keys(updateRow)) {
            rowNode.setDataValue(key, updateRow[key]);
        }
        return true;
    }

    public updateGrid() {
        if (!this.isGridInitialized()) {
            return;
        }
        if (this.setInitData()) {
            return;
        }
        for (const update of this.updateData) {
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
        this.gridOptions = {
            enableRangeSelection: true,
            columnDefs: this.columns,
            getRowNodeId: this.getRowNodeId(),
            onGridReady: this.onGridReady(),
            onFirstDataRendered(params) {
                params.api.sizeColumnsToFit();
            }
        };
    }

    public ngOnInit(): void {

    }

}
