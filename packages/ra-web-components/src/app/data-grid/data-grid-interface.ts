import { ChangeDetectorRef } from "@angular/core";

export interface DataGridInterface {

    initData: any[];
    update: any[];
    initColumns: any[];
    gridKey: string;

    reset(): void;
}
