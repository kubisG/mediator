import { Injectable } from "@angular/core";
import ArrayStore from "devextreme/data/array_store";

@Injectable()
export class DataGridService {

    public ids: string[] = [];
    public idKey: string;

    public insertData: any[] = [];
    public updateData: any[] = [];
    public deleteData: any[] = [];

    public arrayStore: ArrayStore;

    private initStore(initData: any[]) {
        this.arrayStore = new ArrayStore({
            key: this.idKey,
            data: initData
        });
    }

    public insert(data: any[]) {
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (this.ids.indexOf(row[this.idKey]) === -1) {
                this.arrayStore.push([{ type: "insert", data: row }]);
            }
        }
    }

    public update(data: any[]) {
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            this.arrayStore.push([{ type: "update", data: row, key: row[this.idKey] }]);
        }
    }

    public delete(data: any[]) {

    }

    public setIdKey(key: string, initData?: any[]) {
        this.idKey = key;
        this.initStore(initData);
    }

    public reloadIdsMap(data: any[]) {
        if (!this.idKey || !data) {
            return;
        }
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (this.ids.indexOf(row[this.idKey]) === -1) {
                this.ids.push(row[this.idKey]);
            }
        }
    }

}
