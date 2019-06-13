import { Injectable } from "@angular/core";
import { DataGridInterface } from "./data-grid-interface";

@Injectable()
export class DataGridService implements DataGridInterface {
    inicialized = true;
}
