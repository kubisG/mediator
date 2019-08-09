import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";

export enum PushEvents {
    insert = "insert",
    update = "update",
    remove = "remove"
}

export class DataSourceControl {

    private insertSubject: Subject<{ data: any, key: any }> = new Subject<{ data: any, key: any }>();
    public insertSubject$: Observable<{ data: any, key: any }> = this.insertSubject.asObservable();

    private updateSubject: Subject<{ data: any, key: any }> = new Subject<{ data: any, key: any }>();
    public updateSubject$: Observable<{ data: any, key: any }> = this.updateSubject.asObservable();

    private removeSubject: Subject<{ key: any }> = new Subject<{ key: any }>();
    public removeSubject$: Observable<{ key: any }> = this.removeSubject.asObservable();

    private arrayStore: ArrayStore;
    public dataSource: DataSource;

    public lastInserted: any = {};

    constructor(public key: any, data = []) {
        this.initDataSource(data);
    }

    private initDataSource(data = []) {
        this.arrayStore = new ArrayStore({
            key: this.key,
            data: data,
            onPush: (changes) => {
                changes.forEach((change) => {
                    this.dispatchPushEvent(change);
                });
            }
        });
        this.dataSource = new DataSource({
            store: this.arrayStore,
            reshapeOnPush: true,
            pushAggregationTimeout: 1000,
        });
    }

    private dispatchPushEvent(change) {
        switch (change.type) {
            case PushEvents.insert: {
                this.insertSubject.next({ data: change.data, key: change.data[this.key] });
                break;
            }
            case PushEvents.update: {
                this.updateSubject.next({ data: change.data, key: change.key });
                break;
            }
            case PushEvents.remove: {
                this.removeSubject.next({ key: change.key });
                break;
            }
        }
    }

    public getStore() {
        return this.dataSource.store();
    }

    public getSort() {
        return this.dataSource.sort();
    }

    public getFilter() {
        return this.dataSource.filter();
    }

    public getRowByKey(key: any) {
        return this.arrayStore.byKey(`${key}`);
    }

    public setData(data: any[]) {
        // 09.01.2019 - didnt reload the grid, i have to put back both lines :/
        this.initDataSource(data);
        this.dataSource.store()._array = data;
    }

    public reload() {
        this.setData(this.getData());
    }

    public clearData() {
        this.dataSource.store()._array.splice(0);
    }

    public loadData() {
        this.dataSource.store().load();
    }

    public getData(): any[] {
        return this.dataSource.store()._array;
    }

    public insert(data: any) {
        this.dataSource.store().push([{ type: PushEvents.insert, data }]);
        this.lastInserted = data;
    }

    public update(key: any, data: any) {
        this.dataSource.store().push([{ type: PushEvents.update, data, key }]);
    }

    public remove(key: any) {
        this.dataSource.store().push([{ type: PushEvents.remove, key }]);
    }
}
