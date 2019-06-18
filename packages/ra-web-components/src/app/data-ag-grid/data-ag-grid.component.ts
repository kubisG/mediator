import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { GridOptions, RowNode } from "ag-grid-community";
import { DataGridInterface } from "../data-grid/data-grid-interface";

@Component({
    selector: "ra-data-ag-grid",
    templateUrl: "./data-ag-grid.component.html",
    styleUrls: ["./data-ag-grid.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAgGridComponent implements DataGridInterface, OnInit {

    public gridOptions: GridOptions;
    public data: any[];
    public updateData: any[];
    public columns: any[];

    @Input() set initData(data: any[]) {
        if (!data || data.length === 0) {
            return;
        }
        this.data = data;
        this.cd.markForCheck();
    }

    @Input() set update(data: any[]) {
        if (!data || data.length === 0) {
            return;
        }
        this.updateData = data;
        this.updateRow(data);
        this.cd.markForCheck();
    }

    @Input() set initColumns(columns: any[]) {
        if (!columns) {
            return;
        }
        this.columns = columns;
        this.setupGrid();
        this.cd.markForCheck();
    }

    constructor(
        private cd: ChangeDetectorRef,
    ) { }

    public updateRow(data: any[]) {
        if (!this.gridOptions || !this.gridOptions.api) {
            return;
        }
        if (this.gridOptions.api.getDisplayedRowCount() === 0) {
            this.gridOptions.api.setRowData(data);
            return;
        }
        this.updateData = data;
        for (const update of this.updateData) {
            const rowNode: RowNode = this.gridOptions.api.getRowNode(update.id);
            if (!rowNode) {
                this.gridOptions.api.updateRowData({ add: [update] });
                continue;
            }
            for (const key of Object.keys(update)) {
                rowNode.setDataValue(key, update[key]);
            }
        }
    }

    public setupGrid() {
        this.gridOptions = {
            enableRangeSelection: true,
            columnDefs: this.columns,
            getRowNodeId: (data) => {
                return data.id;
            },
            onGridReady: () => {
                if (this.gridOptions.api && this.columns) {
                    this.gridOptions.api.setDomLayout(`normal`);
                    this.gridOptions.api.setAlwaysShowVerticalScroll(true);
                    if (this.gridOptions.api.getDisplayedRowCount() === 0 && this.data) {
                        this.gridOptions.api.setRowData(this.data);
                    }
                }
            },
            onFirstDataRendered(params) {
                params.api.sizeColumnsToFit();
            }
        };
    }

    public ngOnInit(): void {

    }

}
