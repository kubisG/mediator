import { Injectable } from "@angular/core";
import { ToasterService } from "angular2-toaster";
import { RestPreferencesService } from "../../rest/rest-preferences.service";
import { Store } from "@ngxs/store";
import { PreferencesState } from "../../preferences/state/preferences.state";
import { LoggerService } from "../logger/logger.service";

@Injectable()
export class HitlistSettingsService {

    constructor(
        private toasterService: ToasterService,
        private store: Store,
        private preferencesService: RestPreferencesService,
        private logger: LoggerService,
    ) { }

    saveState(key: string, dataGrid: any) {
        const state = dataGrid.state();
        this.preferencesService.hitlistSettingsManager(key, "Put", JSON.stringify(state)).then(
            (data) => {
                this.toasterService.pop("info", "Settings", "Table settings successfully saved");
            })
            .catch(error => {
                this.logger.error(error);
                this.toasterService.pop("error", "Database error", error.message);
            });
    }

    loadState(key: string, dataGrid: any) {
        return this.preferencesService.hitlistSettingsManager(key, "Get").then(
            (data: any) => {
                dataGrid.state(data.body);
                const prefs = this.store.selectSnapshot(PreferencesState.getPrefs);
                if (prefs) {
                    dataGrid.pageSize(prefs.rows);
                }
            }
        );
    }
}
