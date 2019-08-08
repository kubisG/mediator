import { ChangeDetectorRef, EventEmitter } from "@angular/core";
import { Operator } from "../store-querying/operators/operator.interface";
import { Observable } from "rxjs/internal/Observable";

export interface DataGridInterface {

    initData: any[];
    update: any[];
    initColumns: any[];
    sumColumns: any[];
    colors: any[];
    rowActions: any[];
    gridEditable: any[];
    gridKey: string;
    clear: Observable<void>;
    initialized: EventEmitter<any>;
    selected: EventEmitter<any>;
    rowSelected: EventEmitter<any>;
    buttonClick: EventEmitter<any>;
    showRowGroup: string;
    backEndFilterOut: EventEmitter<Operator>;

    reset(): void;

    getState(): any;
    setState(state: any): Promise<any>;
    setColOption(id, option, value);
    setData(data: any[]);
    setSumData(data);
    getData(): any[];
    setFilter(data?);
    refresh();
    beginCustomLoading(info);
    endCustomLoading();
    saveEditData(): Promise<any>;
    checkRows(data);
    addEmptyRow(id): any;
    removeRow(data): any;
}
