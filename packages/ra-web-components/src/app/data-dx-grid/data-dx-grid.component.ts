import { Component, Input, OnInit, ViewChild } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";
import { DxDataGridComponent } from "devextreme-angular";
import { DataGridInterface } from "../data-grid/data-grid-interface";
import * as _ from "lodash";

@Component({
    selector: "ra-data-dx-grid",
    templateUrl: "./data-dx-grid.component.html",
    styleUrls: ["./data-dx-grid.component.less"],
})
export class DataDxGridComponent implements DataGridInterface, OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    @Input() set initData(data: any[]) {
        this.data = data;
        this.initGrid();
    }

    @Input() set update(data: any[]) {
        this.updateData = data;
        this.updateGrid();
    }

    @Input() set initColumns(data: any[]) {
        this.columns = data;
        this.initGrid();
    }

    @Input() gridKey: string;

    public data: any[];
    public updateData: any[];
    public inicialized: boolean;
    public columns: any[];

    public arrayStore: ArrayStore;
    public dataSource: DataSource;

    private ids: any[] = [];

    constructor() { }

    private initGrid() {
        if (this.inicialized || (!this.data || !this.columns)) {
            return;
        }
        this.ids = _.map(this.data, this.gridKey);
        this.arrayStore = new ArrayStore({
            key: this.gridKey,
            data: this.data
        });
        this.dataSource = new DataSource({
            store: this.arrayStore,
            reshapeOnPush: true
        });
        this.inicialized = true;
    }

    private deleteRow(row: any) {
        const keys = Object.keys(row);
        const idIndex = this.ids.indexOf(row[this.gridKey]);
        if (idIndex > -1 && keys.length === 1 && keys[0] === this.gridKey) {
            this.arrayStore.push([{ type: "remove", key: row[this.gridKey] }]);
            this.ids.splice(idIndex, 1);
            return true;
        }
        return false;
    }

    private insertRow(row: any) {
        if (this.ids.indexOf(row[this.gridKey]) === -1) {
            this.arrayStore.push([{ type: "insert", data: row }]);
            this.ids.push(row[this.gridKey]);
            return true;
        }
        return false;
    }

    private updateRow(row: any) {
        if (this.ids.indexOf(row[this.gridKey]) > -1) {
            this.arrayStore.push([{ type: "update", data: row, key: row[this.gridKey] }]);
            return true;
        }
        return false;
    }

    private updateGrid() {
        if (!this.inicialized) {
            this.initGrid();
        }
        for (const update of this.updateData) {
            if (this.deleteRow(update)) {
                continue;
            }
            if (this.insertRow(update)) {
                continue;
            }
            this.updateRow(update);
        }
    }

    reset(): void {

    }

    public onRowClick(e) {

    }

    public onRowPrepared(e) {

    }

    public onRowUpdated(e) {

    }

    public onRowInserted(e) {

    }

    public onContentReady(e) {

    }

    public ngOnInit(): void {

    }

}
