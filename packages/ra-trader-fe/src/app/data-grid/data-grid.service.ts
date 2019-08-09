import { Injectable } from "@angular/core";
import { DataSourceControl } from "./data-source-control";
import { DataGridControl } from "./data-grid-control";
import { RestPreferencesService } from "../rest/rest-preferences.service";
import { Store } from "@ngxs/store";

@Injectable()
export class DataGridService {

    constructor(
        private preferencesService: RestPreferencesService,
        private store: Store,
    ) { }

    public create(key: any, data = []): DataGridControl {
        const sourceControl = new DataSourceControl(key, data);
        const gridControl = new DataGridControl(this.preferencesService, this.store);
        gridControl.setSourceControl(sourceControl);
        return gridControl;
    }

    public createSourceControl(key: any, data = []): DataSourceControl {
        return new DataSourceControl(key, data);
    }

}
