
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { RestCompaniesService } from "../../rest/rest-companies.service";
import { RestInputRulesService } from "../../rest/rest-input-rules.service";
import { LoggerService } from "../../core/logger/logger.service";
import { Store } from "@ngxs/store";
import { AuthState } from "../../core/authentication/state/auth.state";
import { environment } from "../../../environments/environment";

@Component({
    selector: "ra-dialog-user",
    templateUrl: "dialog-user.component.html",
    styleUrls: ["dialog-user.component.less"]
})
export class DialogUserComponent implements OnInit {

    public userClasses = ["ADMIN", "MANAGER", "USER", "READER"];

    public apps: any[] = [
        { id: 0, label: "Trader&Broker" },
        { id: 1, label: "Trader" },
        { id: 2, label: "Broker" }
    ];

    public companies: any[] = [];
    public lists: any[] = [];
    public newBalance = 0;
    public app = 0;
    public balances;

    constructor(
        public dialogRef: MatDialogRef<DialogUserComponent>,
        private companiesService: RestCompaniesService,
        private listsService: RestInputRulesService,
        private logger: LoggerService,
        private store: Store,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.newBalance = this.data.openBalance;
        this.balances = { ...this.data.currentBalance };
    }

    private initCompanies() {
        this.companiesService.getCompanies().then(
            (data) => {
                this.companies = data[0].sort((a, b) => a.companyName.localeCompare(b.companyName));
            })
            .catch((error) => {
                this.companies = [];
            });
    }

    private initInputRules() {
        this.listsService.getInputRules().then(
            (data) => {
                data = data.sort((a, b) => a.name.localeCompare(b.name));
                for (let i = 0; i < data.length; i++) {
                    if (!this.lists[data[i].label]) {
                        this.lists[data[i].label] = [];
                    }
                    if (data[i].label === "Currency") {
                        this.data.currentBalance[data[i].value] =
                            this.data.currentBalance[data[i].value] ? this.data.currentBalance[data[i].value] : 0;
                        this.balances[data[i].value] = Number(this.data.currentBalance[data[i].value])
                            .toLocaleString(undefined, { minimumFractionDigits: environment.precision });
                    }
                    this.lists[data[i].label].push({ name: data[i].name, value: data[i].value });
                }
            })
            .catch((error) => {
                this.logger.error(error);
                this.lists = [];
            });
    }

    public ngOnInit() {
        this.app = this.store.selectSnapshot(AuthState.getApp);
        this.data.app = this.app === 0 ? this.data.app : this.app;
        this.initCompanies();
        this.initInputRules();
    }

    public balanceChange(newBalance, curr) {
        const curBalance = Number(this.data.openBalance[curr]) ? this.data.openBalance[curr] : 0;
        if (newBalance > curBalance) {
            this.data.currentBalance[curr] = Number(this.data.currentBalance[curr]) + (newBalance - curBalance);
            this.balances[curr] = Number(this.data.currentBalance[curr])
                .toLocaleString(undefined, { minimumFractionDigits: environment.precision });
        } else if (newBalance < curBalance) {
            this.data.currentBalance[curr] = Number(this.data.currentBalance[curr]) - (curBalance - newBalance);
            this.balances[curr] = Number(this.data.currentBalance[curr])
                .toLocaleString(undefined, { minimumFractionDigits: environment.precision });
        }
        this.data.openBalance[curr] = newBalance;
    }

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public onOkClick() {
        if (this.app !== 0) {
            this.data.app = this.app;
        }
        this.dialogRef.close(this.data);
    }
}
