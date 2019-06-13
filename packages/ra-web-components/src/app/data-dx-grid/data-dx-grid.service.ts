import { Injectable } from "@angular/core";
import { DataGridInterface } from "../data-grid/data-grid-interface";

@Injectable()
export class DataDxGridService implements DataGridInterface {
    inicialized: boolean;
}
