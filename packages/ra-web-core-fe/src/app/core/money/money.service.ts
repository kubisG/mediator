import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { PreferencesState } from "../../preferences/state/preferences.state";
import { PreferencesModel } from "../../preferences/state/preferences.model";
import { RestPreferencesService } from "../../rest/rest-preferences.service";

@Injectable({ providedIn: "root" })
export class MoneyService {

    private transfers: {};
    private currency;

    public prefs: PreferencesModel;
    public balance: any = { allBalance: 0, allOpenBalance: 0 };

    constructor(
        private store: Store,
        private preferencesService: RestPreferencesService
    ) {
        const that = this;
        this.prefs = this.store.selectSnapshot(PreferencesState.getPrefs);
        this.currency = this.prefs.currency;
        this.loadTransfers(this.currency).then((transfer) => that.transfers = transfer);
    }

    public setBalance(balance: any) {
        this.balance = balance;
        if (this.balance.currentBalance) {
            const keys = Object.keys(this.balance.currentBalance);
            this.balance.allBalance = 0;
            for (let i = 0; i < keys.length; i++) {
                if (this.balance.currentBalance[keys[i]] !== null) {
                    this.balance.allBalance = (this.balance.allBalance ? this.balance.allBalance : 0)
                        + this.recalculateMoney(this.balance.currentBalance[keys[i]], keys[i]);
                }
            }
        }

        if (this.balance.openBalance) {
            const keys = Object.keys(this.balance.openBalance);
            this.balance.allOpenBalance = 0;
            for (let i = 0; i < keys.length; i++) {
                if (this.balance.openBalance[keys[i]] !== null) {
                    this.balance.allOpenBalance = (this.balance.allOpenBalance ? this.balance.allOpenBalance : 0)
                        + this.recalculateMoney(this.balance.openBalance[keys[i]], keys[i]);
                }
            }
        }

    }

    public setTransfers(transfers?: any, curr?: any) {
        const that = this;
        if ((transfers) && (transfers !== null)) {
            this.transfers = transfers;
        }

        if ((curr) && (curr !== null)) {
            this.currency = curr;

            this.loadTransfers(curr).then((transfer) => {
                that.transfers = transfer;
            });
        }
    }

    public loadTransfers(curr): any {
        return this.preferencesService.getUserPref(curr.value + "_transfers").then((data) => {
            let retVal = {};
            if (data) {
                retVal = data;
            } else {
                retVal[curr.value] = 1;
            }
            return retVal;
        });
    }

    formatMoney(value: any) {
        return this.currency.name + value;
    }

    recalculateMoney(value: number, sourceCode: string) {
        let priceVal = 1;
        if ((this.transfers) && (this.transfers[sourceCode])) {
            priceVal = this.transfers[sourceCode];
        }
        return value / priceVal;
    }
}
