import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";
import { DxDataGridComponent } from "devextreme-angular";
import { DataGridInterface } from "../data-grid/data-grid-interface";
import * as _ from "lodash";
import { Operator } from "../store-querying/operators/operator.interface";
import { Observable } from "rxjs/internal/Observable";

@Component({
    selector: "ra-data-dx-grid",
    templateUrl: "./data-dx-grid.component.html",
    styleUrls: ["./data-dx-grid.component.less"],
})
export class DataDxGridComponent implements DataGridInterface, OnInit {
    clear: Observable<void>;

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    public rowColors = {};
    public rowActions = [];
    public editable = false;

    @Output() initialized: EventEmitter<any> = new EventEmitter();
    @Output() selected: EventEmitter<any> = new EventEmitter();
    @Output() rowSelected: EventEmitter<any> = new EventEmitter();
    @Output() buttonClick: EventEmitter<any> = new EventEmitter(); // not implemented
    @Output() backEndFilterOut: EventEmitter<Operator> = new EventEmitter<Operator>();

    @Input() showRowGroup;

    @Input() set colors(data) {
        this.rowColors = data;
    }

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

    @Input() set sumColumns(data: any[]) {
        this.sumCols = data;
    }

    @Input() gridKey: string;

    @Input() set gridEditable(data: any) {
        this.editable = data;
    }

    public data: any[];
    public updateData: any[];
    public inicialized: boolean;
    public columns: any[];
    public sumCols: any[];
    public frameworkComponents = {};

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

    public setFilter(data?) {
        if (data) {
            this.dataGrid.instance.filter(data);
        } else {
            this.dataGrid.instance.clearFilter();
        }
    }

    public getState(): any {
        return this.dataGrid.instance.state();
    }

    public setState(state: any): Promise<any> {
        return Promise.resolve(this.dataGrid.instance.state(JSON.parse(state)));
    }

    public setColOption(id, option, value) {
        this.dataGrid.instance.columnOption(id, option, value);
    }

    public setData(data: any[]) {
        this.data = data;
    }

    public setSumData(data) {
        console.log("dx sumdata done by columns settings");
    }

    public getData(): any[] {
        return this.dataSource.store()._array;
    }

    public saveEditData(): Promise<any> {
        return this.dataGrid.instance.saveEditData();
    }

    public beginCustomLoading(info) {
        this.dataGrid.instance.beginCustomLoading(info);
    }

    public endCustomLoading() {
        this.dataGrid.instance.endCustomLoading();
    }


    public refresh() {
        this.dataGrid.instance.refresh();
    }

    public checkRows(data) {
        console.log("dummy checkrows", data);
    }

    public addEmptyRow(id): any {
        console.log("dummy addEmptyRow", id);
        return null;
    }

    public removeRow(data): any {
        console.log("dummy removeRow");
        return null;
    }

    public onRowClick(e) {
        this.rowSelected.next(e);
    }

    public onRowPrepared(item) {
        if (item.data) {
            if (this.rowColors) {
                item.rowElement.style.backgroundColor = this.rowColors[item.data.OrdStatus];
            }
        }
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
