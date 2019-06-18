import { Component, Input, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { GridOptions, RowNode } from "ag-grid-community";

@Component({
    selector: "ra-data-ag-grid",
    templateUrl: "./data-ag-grid.component.html",
    styleUrls: ["./data-ag-grid.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAgGridComponent implements OnInit {

    public gridOptions: GridOptions;
    public data: any[];
    public updateData: any[];
    public columns: any[];

    @Input() set initData(data: any[]) {
        this.data = data;
    }

    @Input() set update(data: any[]) {
        this.updateData = data;
        this.updateRow(data);
    }

    @Input() set initColumns(columns: any[]) {
        this.columns = columns;
        this.setupGrid();
    }

    constructor() { }

    private updateRow(data: any[]) {
        if (this.gridOptions.api.getDisplayedRowCount() === 0) {
            this.gridOptions.api.setRowData(data);
            return;
        }
        this.updateData = data;
        if (this.gridOptions.api && this.columns) {
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
    }

    private setupGrid() {
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
