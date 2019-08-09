
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { RestInputRulesService } from "../../rest/rest-input-rules.service";
import { LoggerService } from "../../core/logger/logger.service";
import { Store } from "@ngxs/store";
import { AuthState } from "../../core/authentication/state/auth.state";
import { AppType } from "@ra/web-shared-fe";
import { PreferencesState } from "../../preferences/state/preferences.state";


@Component({
    selector: "ra-dialog-counter-party",
    templateUrl: "dialog-counter-party.component.html",
    styleUrls: ["dialog-counter-party.component.less"]
})
export class DialogCounterPartyComponent implements OnInit {

    public lists = {};
    public inicialized = false;
    public data;
    public apps: any[] = [
        { id: 1, label: "Trader" },
        { id: 2, label: "Broker" }
    ];

    constructor(
        public dialogRef: MatDialogRef<DialogCounterPartyComponent>,
        private restInputRulesService: RestInputRulesService,
        private store: Store,
        private logger: LoggerService,
        @Inject(MAT_DIALOG_DATA) public passData: any,
    ) {
        this.data = passData.data;
        const app = this.store.selectSnapshot(AuthState.getUser);
        if (!app.appPrefs.spliting) {
            if (app.app === AppType.Trader) {
                this.apps.splice(0, 1);
            } else if (app.app === AppType.Broker) {
                this.apps.splice(1, 1);
            }
        }
    }

    ngOnInit() {
        this.restInputRulesService.getInputRules().then(
            (data) => {
                data = data.sort((a, b) => a.name.localeCompare(b.name));
                for (let i = 0; i < data.length; i++) {
                    if (!this.lists[data[i].label]) {
                        this.lists[data[i].label] = [];
                    }
                    this.lists[data[i].label].push({ name: data[i].name, value: data[i].value });
                }
                this.inicialized = true;
            })
            .catch((error) => {
                this.logger.error(error);
                this.lists = [];
            });
    }


    public onNoClick(): void {
        this.dialogRef.close();
    }

    public onOkClick() {
        this.dialogRef.close(this.data);
    }
}
