import { Type, InjectionToken } from "@angular/core";
import { DataGridInterface } from "./data-grid-interface";

export const DATA_GRID_COMPONENTS = new InjectionToken<DataGridComponentsMap>("dataGridComponents");

export interface DataGridComponentsMap {

    default: Type<DataGridInterface>;
    [key: string]: Type<DataGridInterface>;

}
