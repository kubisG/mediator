import { Injectable } from "@angular/core";
import { RestPreferencesService } from "./rest-preferences.service";
import { RestInputRulesService } from "./rest-input-rules.service";
import { RestAccountsService } from "./rest-accounts.service";
import { LoggerService } from "../core/logger";

@Injectable({
    providedIn: "root",
})
export class OrderInitService {

    private lists;
    private accounts;
    private rowColors;

    constructor(
        private restPreferencesService: RestPreferencesService,
        private listsService: RestInputRulesService,
        private restAccountsService: RestAccountsService,
        private logger: LoggerService,
    ) {
        this.setupColors();
        this.getAccounts();
    }

    getRowColors() {
        if (!this.rowColors) {
            return this.setupColors();
        } else {

            return Promise.resolve(this.rowColors);
        }
    }

    getAccounts() {
        if (!this.accounts) {
            return this.restAccountsService.getAccounts().then(
                (accdata) => {
                    this.accounts = accdata;
                    return this.accounts;
                }
            );
        } else {
            return Promise.resolve(this.accounts);
        }
    }

    getLists(): Promise<any> {

        if (!this.lists) {
            return this.listsService.getInputRules().then(
                (data) => {
                    const lists = {};
                    data = data.sort((a, b) => a.name.localeCompare(b.name));
                    for (let i = 0; i < data.length; i++) {
                        if (!lists[data[i].label]) {
                            lists[data[i].label] = [];
                        }
                        lists[data[i].label].push({ name: data[i].name, value: data[i].value });
                    }
                    this.lists = lists;
                    return lists;
                })
                .catch((error) => {
                    this.logger.error(error);
                    this.lists = [];
                    return this.lists;
                });
        } else {
            return Promise.resolve(this.lists);
        }
    }

    private setupColors() {
        return this.restPreferencesService.getPreferences().then((prefs) => {
            this.rowColors = prefs.pref ? prefs.pref.rowColors : {};
            return this.rowColors;
        });
    }

}
