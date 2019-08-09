import { DataSourceControl } from "./data-source-control";
import DxDataGrid from "devextreme/ui/data_grid";
import { RestPreferencesService } from "../rest/rest-preferences.service";
import { Store } from "@ngxs/store";
import { PreferencesState } from "../preferences/state/preferences.state";

export class DataGridControl {

    public dataSourceControl: DataSourceControl;
    private currentKey: any;
    public dxDataGrid: DxDataGrid;

    constructor(
        private preferencesService: RestPreferencesService,
        private store: Store,
    ) { }

    public getSourceControl() {
        return this.dataSourceControl;
    }

    public setSourceControl(dataSourceControl: DataSourceControl) {
        this.dataSourceControl = dataSourceControl;
    }

    public setDxDataGrid(dxDataGrid: DxDataGrid) {
        this.dxDataGrid = dxDataGrid;
    }

    public rowClick(e) {
        if (this.currentKey > -1 && this.currentKey !== e.key) {
            const prevIndex = this.dxDataGrid.getRowIndexByKey(this.currentKey);
            (this.dxDataGrid.getRowElement(prevIndex) as any[])
                .forEach(el => el.classList.remove("highlightColor"));
        }
        this.currentKey = e.key;
        (this.dxDataGrid.getRowElement(e.rowIndex) as any[])
            .forEach(el => el.classList.add("highlightColor"));
    }

    saveState(key: string): Promise<any> {
        const state = this.dxDataGrid.state();
        return this.preferencesService.hitlistSettingsManager(key, "Put", JSON.stringify(state));
    }

    loadState(key: string): Promise<any> {
        return this.preferencesService.hitlistSettingsManager(key, "Get").then(
            (data: any) => {
                const prefs = this.store.selectSnapshot(PreferencesState.getPrefs);
                if (data.body) {
                    if (prefs) {
                        data.body.pageSize = prefs.rows;
                    }
                    this.dxDataGrid.state(data.body);
                } else {
                    if (prefs) {
                        this.dxDataGrid.pageSize(prefs.rows);
                    }
                }
                return data;
            }
        );
    }

}
