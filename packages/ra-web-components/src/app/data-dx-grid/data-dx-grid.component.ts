import { Component, Input, OnInit, EventEmitter, Output, ViewChild } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";
import { DxDataGridComponent } from "devextreme-angular";

@Component({
    selector: "ra-data-dx-grid",
    templateUrl: "./data-dx-grid.component.html",
    styleUrls: ["./data-dx-grid.component.less"],
})
export class DataDxGridComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    public inicialized = false;
    private currentKey = -1;
    private _inserts: any[];
    public _columns: any[];
    public _key: string;
    public dataSource: DataSource;
    public arrayStore: ArrayStore;

    public ids: string[] = [];

    @Input() set data(rows: any[]) {
        this._inserts = rows;
        this.reloadIdsMap(rows);
    }

    @Input() set updates(rows: any[]) {
        this.reloadIdsMap(rows);
    }

    @Input() set removes(rows: any[]) {
        this.reloadIdsMap(rows, "D");
    }

    @Input() set key(key: string) {
        this._key = key;
        this.setIdKey(key);
    }

    @Input() set columns(columns: any[]) {
        this._columns = columns;
    }

    @Output() rowClick: EventEmitter<any> = new EventEmitter();

    constructor() { }

    public setIdKey(key: string, initData?: any[]) {
        this._key = key;
        this.initGrid();
    }

    private initGrid() {
        this.arrayStore = new ArrayStore({
            key: this._key,
            data: this._inserts
        });

        this.dataSource = new DataSource({
            store: this.arrayStore,
            reshapeOnPush: true
        });
        this.inicialized = true;

    }

    public insert(row: any) {
        if (this.inicialized) {
            this.arrayStore.push([{ type: "insert", data: row }]);
        }
    }

    public update(row: any) {
        if (this.inicialized) {
            this.arrayStore.push([{ type: "update", data: row, key: row[this._key] }]);
        }
    }

    public delete(row: any) {
        if (this.inicialized) {
            this.arrayStore.push([{ type: "remove", key: row }]);
            this.currentKey = null;
        }
    }

    public reloadIdsMap(data: any[], action = "N") {
        if (!this._key || !data) {
            return;
        }
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (action === "D") {
                const index = this.ids.indexOf(row);
                if (index !== -1) {
                    this.ids.splice(index, 1);
                    this.delete(row);
                }
            } else {
                if (this.ids.indexOf(row[this._key]) === -1) {
                    this.ids.push(row[this._key]);
                    this.insert(row);
                } else {
                    this.update(row);
                }
            }
        }
    }

    public onRowClick(e) {
        if (e.rowType !== "data") { return; }
        if (this.currentKey > -1) {
            const prevIndex = this.dataGrid.instance.getRowIndexByKey(this.currentKey);

            (this.dataGrid.instance.getRowElement(prevIndex) as any[])
                .forEach(el => el.classList.remove("highlightColor"));
        }

        if (this.currentKey === e.key) {
            this.currentKey = null;
        } else {
            this.currentKey = e.key;
            e.rowElement.classList.add("highlightColor");
        }

        this.rowClick.emit(e);
    }

    public onRowPrepared(e) {
        if (this.currentKey === e.key) {
            e.rowElement.classList.add("highlightColor");
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
