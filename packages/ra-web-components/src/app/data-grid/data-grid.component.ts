import { Component, Input, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { DataGridService } from './data-grid.service';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from "devextreme/data/array_store";

@Component({
    selector: "ra-data-grid",
    templateUrl: "./data-grid.component.html",
    styleUrls: ["./data-grid.component.less"],
})
export class DataGridComponent implements OnInit {

    public _data: any[];
    public _updates: any[];
    public _columns: any[];
    public _key: string;
    public dataSource: DataSource;
    public arrayStore: ArrayStore;

    public ids: string[] = [];

    @Input() set data(data: any) {
        this._data = data;
        this.insert(data);
        this.reloadIdsMap(this._data);
    };

    @Input() set updates(updates: any[]) {
        this._updates = updates;
        this.update(updates);
        this.reloadIdsMap(this._updates);
    };

    @Input() set key(key: string) {
        this._key = key;
        this.setIdKey(key, this.data);
        this.reloadIdsMap(this._data);
        this.reloadIdsMap(this._updates);
        this.initDataSource(this.arrayStore);
    };

    @Input() set columns(columns: any[]) {
        this._columns = columns;
    };

    constructor() { }

    private initDataSource(store: ArrayStore) {
        this.dataSource = new DataSource({
            store: store,
            reshapeOnPush: true
        });
    }

    private initStore(initData: any[]) {
        this.arrayStore = new ArrayStore({
            key: this._key,
            data: initData
        });
    }

    public insert(data: any[]) {
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (this.ids.indexOf(row[this._key]) === -1) {
                this.arrayStore.push([{ type: "insert", data: row }]);
            }
        }
    }

    public update(data: any[]) {
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            this.arrayStore.push([{ type: "update", data: row, key: row[this._key] }]);
        }
    }

    public delete(data: any[]) {

    }

    public setIdKey(key: string, initData?: any[]) {
        this._key = key;
        this.initStore(initData);
    }

    public reloadIdsMap(data: any[]) {
        if (!this._key || !data) {
            return;
        }
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (this.ids.indexOf(row[this._key]) === -1) {
                this.ids.push(row[this._key]);
            }
        }
    }

    public ngOnInit(): void {

    }

}
