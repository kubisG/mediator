
import { Component, Inject, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Store } from "@ngxs/store";
import { WeekDay } from "@angular/common";

import { AuthState } from "../../core/authentication/state/auth.state";
import { RestInputRulesService } from "../../rest/rest-input-rules.service";
import { FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";
import { InputRules } from "../../input-rules/input-rules";
import { InputRulesService } from "../../input-rules/input-rules.service";
import { LoggerService } from "../../core/logger/logger.service";
import { RestAccountsService } from "../../rest/rest-accounts.service";
import { RestPreferencesService } from "../../rest/rest-preferences.service";
import { NotifyService } from "../../core/notify/notify.service";
import { OrdType } from "@ra/web-shared-fe";
import { RestStockDataService } from "../../rest/rest-stock-data.service";
import { RestCounterPartyService } from "../../rest/rest-counter-party.service";
import { AppType } from "@ra/web-shared-fe";
import { TypesArray } from "@ra/web-shared-fe";
import { environment } from "../../../environments/environment";
import { RestTraderService } from "../../rest/rest-trader.service";


@Component({
    selector: "ra-order-dialog",
    templateUrl: "./order-dialog.component.html",
    styleUrls: ["./order-dialog.component.less"]
})
export class OrderDialogComponent implements OnInit, OnDestroy {

    public orderForm: FormGroup = new FormGroup({
        Side: new FormControl({ value: null, disabled: (this.data.action === "R") }),
        OrderQty: new FormControl({ value: null, disabled: (this.data.action === "R") },
            [Validators.required, Validators.min(1), Validators.max(9999999999)]),
        OnBehalfOfSubID: new FormControl(),
        ClientID: new FormControl(),
        Account: new FormControl(),
        AvgPx: new FormControl({ value: null, disabled: (this.data.action === "R") }),
        CumQty: new FormControl({ value: null, disabled: (this.data.action === "R") }),
        NewOrderQty: new FormControl([Validators.min(1), Validators.max(9999999999)]),
        SecurityDesc: new FormControl({ value: null, disabled: true }),
        Symbol: new FormControl([Validators.required]),
        SecurityID: new FormControl({ value: null }),
        SecurityIDSource: new FormControl({ value: null, disabled: true }),
        OrdType: new FormControl([Validators.required]),
        TradeDate: new FormControl({ value: null, disabled: (this.data.action === "R") }),
        Price: new FormControl(),
        StopPx: new FormControl(),
        OddLot: new FormControl({ value: false, disabled: (this.data.action === "R") }),
        SettlDate: new FormControl({ value: null, disabled: (this.data.action === "R") }),
        Currency: new FormControl({ value: null, disabled: (this.data.action === "R") }, [Validators.required]),
        LocateReqd: new FormControl({ value: false, disabled: (this.data.action === "R") }),
        ExecInst: new FormControl(),
        TimeInForce: new FormControl({ value: "Day", disabled: false }, [Validators.required]),
        ExpireDate: new FormControl(),
        ExDestination: new FormControl({ value: null, disabled: true }, [Validators.required]),
        TargetCompID: new FormControl({ value: null, disabled: (this.data.action === "R") }, [Validators.required]),
        OrderCapacity: new FormControl({ value: null, disabled: (this.data.action === "R") }),
        CommType: new FormControl(),
        DeliverToSubID: new FormControl(),
        Commission: new FormControl(),
        Text: new FormControl(),
        BookingType: new FormControl({ value: "RegularBooking", disabled: (this.data.action === "R") }),
        HandlInst: new FormControl({ value: "ManualOrder", disabled: false }, [Validators.required]),
    });

    private orderFormOrig;
    public appType = AppType;
    public disabled = false;

    public lists = {};
    public symbols = {};
    public accounts = [];
    public clients = [];
    public parties = [];
    public bookChecked;
    public inputRules: InputRules;
    public isFormValid = false;
    public inicialized = false;
    public bookingCheck = false;
    private sending = false;
    public formType = "B";
    private formSub;
    private symbolSub;
    private ordTypeSub;
    public user;

    constructor(
        public dialogRef: MatDialogRef<OrderDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private store: Store,
        public inputRulesService: InputRulesService,
        private restInputRulesService: RestInputRulesService,
        private restAccountsService: RestAccountsService,
        private restPreferencesService: RestPreferencesService,
        private restCounterPartyService: RestCounterPartyService,
        private toasterService: NotifyService,
        private restStockDataService: RestStockDataService,
        private restOrdersService: RestTraderService,
        private logger: LoggerService,
    ) {
        this.sending = false;
        if ((this.data.data) && (this.data.data.ClOrdLinkID)) {
            this.orderForm.addControl("ClOrdLinkID", new FormControl());
        }
    }

    changeBooking(val) {
        this.orderForm.controls["BookingType"].setValue(val && val.checked === true ? "CFD" : "RegularBooking");
    }

    private getSettlDate(date?: Date): Date {
        const today = date ? date : new Date();
        today.setDate((today.getDate() + 2));
        if ((today.getDay() === WeekDay.Saturday)) {
            today.setDate((today.getDate() + 2));
        } else if (today.getDay() === WeekDay.Sunday) {
            today.setDate((today.getDate() + 1));
        }
        return today;
    }

    private newQtyValidator(control: FormControl) {
        if (control.value < control.parent.controls["CumQty"].value) {
            return {
                newQty: "Invalid replace Qty"
            };
        }
        return null;
    }

    private copyFormControl(control: AbstractControl) {
        if (control instanceof FormControl) {
            return new FormControl(control.value);
        } else if (control instanceof FormGroup) {
            const copy = new FormGroup({});
            Object.keys(control.getRawValue()).forEach(key => {
                if ((key !== "AvgPx") && (key !== "CumQty") && (key !== "NewOrderQty")) {
                    copy.addControl(key, this.copyFormControl(control.controls[key]));
                }
            });
            return copy;
        }
    }

    private qtyValidator(control: FormControl) {
        if (control.value > control.parent.controls["chckQty"].value) {
            return {
                newQty: "Qty bigger than leaves qty"
            };
        }
        return null;
    }

    private setParentChild() {
        for (const key in this.data.data) {
            if (this.data.data.hasOwnProperty(key)) {
                if (this.orderForm.controls.hasOwnProperty(key)) {
                    if (TypesArray.numVals.indexOf(key) > -1) {
                        this.orderForm.controls[key].setValue(Number(this.data.data[key]).toFixed(environment.precision));
                    } else {
                        this.orderForm.controls[key].setValue(this.data.data[key]);
                    }
                } else {
                    this.orderForm.addControl(key, new FormControl(this.data.data[key]));
                }
            }
        }
        const user = this.store.selectSnapshot(AuthState.getUser);

        this.orderForm.controls["OnBehalfOfSubID"].setValue(user.username);
        this.bookingCheck = this.orderForm.controls["BookingType"].value === "CFD";

        this.restOrdersService.getChildsQty(this.data.data.ClOrdLinkID).then(
            (qty) => {
                this.inicialized = true;
                this.orderForm.addControl("chckQty", new FormControl(
                    Number(this.data.LeavesQty ? this.data.LeavesQty : this.data.data.OrderQty)
                    - Number(qty)
                ));
                if (this.data.action === "N") {
                    this.orderForm.controls["OrderQty"].setValue(
                        this.orderForm.controls["chckQty"].value
                    );
                }
                this.orderForm.updateValueAndValidity();
            }
        );

        this.orderForm.controls["OrderQty"].setValidators([Validators.required, Validators.min(1), this.qtyValidator]);
    }

    private setSavedTicket() {
        this.restPreferencesService.getUserPref("dealticket").then((val) => {

            if (val === null) {
                this.orderForm.controls["OnBehalfOfSubID"].setValue(this.user.username);
                this.orderForm.controls["TradeDate"].setValue(new Date());
                this.orderForm.controls["SettlDate"].setValue(this.getSettlDate());
                this.inicialized = true;
                this.orderForm.updateValueAndValidity();

                return;
            }
            for (const key in val) {
                if (val.hasOwnProperty(key)) {
                    if (this.orderForm.controls.hasOwnProperty(key)) {
                        this.orderForm.controls[key].setValue(val[key]);
                    } else {
                        this.orderForm.addControl(key, new FormControl(val[key]));
                    }
                }
            }

            this.orderForm.controls["TradeDate"].setValue(new Date());
            this.orderForm.controls["SettlDate"].setValue(this.getSettlDate());
            this.orderForm.controls["OnBehalfOfSubID"].setValue(this.user.username);
            this.bookingCheck = this.orderForm.controls["BookingType"].value === "CFD";
            this.inicialized = true;
            this.orderForm.updateValueAndValidity();
        });
    }

    /**
     * TODO : split method
     */
    ngOnInit() {
        this.orderFormOrig = this.copyFormControl(this.orderForm);

        this.user = this.store.selectSnapshot(AuthState.getUser);
        this.restAccountsService.getAccounts().then(
            (data) => { this.accounts = data; }
        );
        if (this.data.appType === AppType.Self) {
            this.parties = [{
                id: 1, ExDestination: "", CounterParty: this.user.companyName
                , DeliveryToCompID: this.user.compQueueBroker
            }];
            this.orderForm.controls["TargetCompID"].setValue(this.user.compQueueBroker);
            this.restCounterPartyService.getRecords(AppType.Trader).then(
                (data) => { this.clients = data; }
            );
        } else {
            this.restCounterPartyService.getRecords(this.data.appType).then(
                (data) => { this.parties = data; }
            );
        }
        this.inputRules = this.inputRulesService.create();
        this.restInputRulesService.getRules("all").then((rules) => {
            this.inputRules.addAllRules(rules);
            if ((!this.data.data) || (!this.data.data.ClOrdID) || ((this.data.data) && (this.data.data.ClOrdLinkID))) {

                if ((((this.data.data) && (this.data.data.ClOrdLinkID)))) {
                    this.setParentChild();
                } else {
                    this.setSavedTicket();
                }
            } else {
                for (const key in this.data.data) {
                    if (this.data.data.hasOwnProperty(key)) {
                        if (this.orderForm.controls.hasOwnProperty(key)) {
                            if (TypesArray.numVals.indexOf(key) > -1) {
                                this.orderForm.controls[key].setValue(Number(this.data.data[key]).toFixed(environment.precision));
                            } else {
                                this.orderForm.controls[key].setValue(this.data.data[key]);
                            }
                        } else {
                            this.orderForm.addControl(key, new FormControl(this.data.data[key]));
                        }
                    }
                }
                this.orderForm.controls["NewOrderQty"].setValue(
                    Number(this.orderForm.controls["OrderQty"].value)
                );
                this.orderForm.controls["TargetCompID"].setValue(
                    this.orderForm.controls["DeliverToCompID"].value
                );
                this.orderForm.controls["NewOrderQty"].setValidators([Validators.required, Validators.min(1)
                    , Validators.max(9999999999), this.newQtyValidator]);
                this.bookingCheck = this.orderForm.controls["BookingType"].value === "CFD";
                this.inicialized = true;
                this.orderForm.updateValueAndValidity();

            }
        });
        this.restInputRulesService.getInputRules().then(
            (data) => {
                data = data.sort((a, b) => a.name.localeCompare(b.name));
                for (let i = 0; i < data.length; i++) {
                    if (!this.lists[data[i].label]) {
                        this.lists[data[i].label] = [];
                    }
                    this.lists[data[i].label].push({ name: data[i].name, value: data[i].value });
                }
            })
            .catch((error) => {
                this.logger.error(error);
                this.lists = [];
            });
        this.formSub = this.orderForm.statusChanges.subscribe((data) => {
            if (this.inicialized) {
                if (data === "INVALID") {
                    this.isFormValid = false;
                } else {
                    this.isFormValid = true;
                }
            }
        });
        this.symbolSub = this.orderForm.controls["Symbol"].valueChanges.subscribe((data) => {
            this.getPrice(data, true);
        });
        this.ordTypeSub = this.orderForm.controls["OrdType"].valueChanges.subscribe((data) => {
            this.getPrice(data);
        });
    }

    saveDeal() {
        for (const key in this.orderFormOrig.controls) {
            if (this.orderFormOrig.controls.hasOwnProperty(key)) {
                if (this.orderForm.controls.hasOwnProperty(key)) {
                    this.orderFormOrig.controls[key].setValue(this.orderForm.controls[key].value);
                }
            }
        }
        this.restPreferencesService.saveUserPref("dealticket", this.orderFormOrig.getRawValue()).then(
            (data) => { this.toasterService.pop("info", "Default ticket successfully saved"); }
        ).catch((error) => {
            this.toasterService.pop("error", "Database error", error.error.message);
        });
    }

    sendOrder() {
        this.disabled = true;
        this.sending = true;

        if (!this.user.appPrefs.OddLot) {
            this.orderForm.controls["OddLot"].setValue(null);
        }

        if (this.data.action === "R") {
            this.dialogRef.close({
                ...this.orderForm.getRawValue(),
                CumQty: this.orderForm.controls["CumQty"].value
            });
        } else {
            this.dialogRef.close(this.orderForm.getRawValue());
        }
    }

    public switchDialog(type: string) {
        this.formType = type;
        if (type === "A") {
            this.dialogRef.updateSize("70%", "auto");
        } else {
            this.dialogRef.updateSize("40%", "auto");
        }
    }

    public async getPrice(data, reload = false) {
        if ((this.sending) || (!this.inicialized)) { return; }

        const ordType = this.orderForm.controls["OrdType"].value;
        const mySymbol = this.orderForm.controls["Symbol"].value;
        if (ordType === OrdType.Limit) {
            let myPrice = this.orderForm.controls["Price"].value;
            if ((!myPrice) || (myPrice === 0) || reload) {
                if (!(this.symbols[mySymbol])) {
                    const symbol = await this.restStockDataService.getSymbolPx(mySymbol);
                    if ((symbol) && (symbol[0]) && (symbol !== null)) {
                        this.symbols[mySymbol] = symbol[0].lastPx;
                    } else {
                        this.symbols[mySymbol] = 0;
                    }
                }
                myPrice = Number(this.symbols[mySymbol]).toFixed(2);
                this.orderForm.controls["Price"].setValue(myPrice ? myPrice : null);
            }
        } else {
            this.orderForm.controls["Price"].setValue(null);
        }
    }

    public changeParty(evt) {
        const choosenParty = this.parties.filter(function (party) {
            return party.DeliveryToCompID === evt.value;
        })[0];
        this.orderForm.controls["ExDestination"].enable();
        this.orderForm.controls["ExDestination"].setValue(choosenParty.ExDestination);
        this.orderForm.controls["ExDestination"].disable();
        this.orderForm.controls["Commission"].setValue(choosenParty.Commission);
        this.orderForm.controls["CommType"].setValue(choosenParty.CommType);
    }

    public onTradeDate(event): void {
        this.orderForm.controls["SettlDate"].setValue(this.getSettlDate(new Date(event.value)));
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnDestroy() {
        if (this.formSub) {
            this.formSub.unsubscribe();
        }

        if (this.symbolSub) {
            this.symbolSub.unsubscribe();
        }

        if (this.ordTypeSub) {
            this.ordTypeSub.unsubscribe();
        }

    }
}
