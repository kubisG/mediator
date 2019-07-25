import { ChangeDetectorRef, EventEmitter } from "@angular/core";

export interface DataGridInterface {

    initData: any[];
    update: any[];
    initColumns: any[];
    colors: any[];
    rowActions: any[];
    gridEditable: any[];
    gridKey: string;
    initialized: EventEmitter<any>;
    selected: EventEmitter<any>;
    rowSelected: EventEmitter<any>;
    buttonClick: EventEmitter<any>;

    reset(): void;

    getState(): any;
    setState(state: any): Promise<any>;
    setColOption(id, option, value);
    setData(data: any[]);
    getData(): any[];
    setFilter(data);
    refresh();
    beginCustomLoading(info);
    endCustomLoading();
    saveEditData(): Promise<any>;
    checkRows(data);
    addEmptyRow(id): any;
    removeRow(data): any;
}
