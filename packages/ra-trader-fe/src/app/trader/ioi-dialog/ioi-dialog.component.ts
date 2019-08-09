
import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { RestInputRulesService } from "../../rest/rest-input-rules.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { InputRules } from "../../input-rules/input-rules";
import { InputRulesService } from "../../input-rules/input-rules.service";
import { LoggerService } from "../../core/logger/logger.service";
import { IOIType } from "@ra/web-shared-fe";
import { Side } from "@ra/web-shared-fe";
import { RestCounterPartyService } from "../../rest/rest-counter-party.service";
import { AppType } from "@ra/web-shared-fe";


@Component({
    selector: "ra-ioi-dialog",
    templateUrl: "./ioi-dialog.component.html",
    styleUrls: ["./ioi-dialog.component.less"]
})
export class IoiDialogComponent implements OnInit, OnDestroy {

    public saveButton = false;
    public enabledVals = [Side.Sell, Side.Buy];

    public ioiForm: FormGroup = new FormGroup({
        SecurityDesc: new FormControl(),
        Symbol: new FormControl(),
        SecurityID: new FormControl(),
        SecurityIDSource: new FormControl(),
        Side: new FormControl(),
        Price: new FormControl({
            value: null, disabled:
                ((this.data.data.Canceled === "Y") || (this.data.data.Type === IOIType.Incoming))
        }, [Validators.min(0), Validators.max(9999999999)]),
        IOIQty: new FormControl({ value: null, disabled: (this.data.action === "R") }, [Validators.min(1), Validators.max(9999999999)]),
        Stipulations: new FormControl({
            value: null, disabled:
                ((this.data.data.Canceled === "Y") || (this.data.data.Type === IOIType.Incoming))
        }),
        Text: new FormControl({
            value: null, disabled:
                ((this.data.data.Canceled === "Y") || (this.data.data.Type === IOIType.Incoming))
        }),
        Currency: new FormControl({ value: null, disabled: (this.data.action === "R") }),
        ConfirmTo: new FormControl({
            value: null, disabled:
                ((this.data.data.Canceled === "Y") || (this.data.data.Type === IOIType.Incoming))
        }),
        ValidUntilTime: new FormControl({ value: null, disabled: (this.data.action === "R") }),
        ExDestination: new FormControl("NEWFIXBROKER"),
        TargetCompID: new FormControl({
            value: null, disabled:
                ((this.data.data.Canceled === "Y") || (this.data.data.Type === IOIType.Incoming))
        }),
    });

    public lists = {};
    public parties = [];
    public inputRules: InputRules;
    public isFormValid = false;
    public inicialized = false;
    private formSub;

    constructor(
        public dialogRef: MatDialogRef<IoiDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public inputRulesService: InputRulesService,
        private restInputRulesService: RestInputRulesService,
        private restCounterPartyService: RestCounterPartyService,
        private logger: LoggerService,
    ) {
        if ((this.data.data.Canceled === "Y") || (this.data.data.Type === IOIType.Incoming)) {
            this.saveButton = false;
        } else {
            this.saveButton = true;
        }

        for (const key in data.data) {
            if (data.data.hasOwnProperty(key)) {
                if (this.ioiForm.controls.hasOwnProperty(key)) {
                    this.ioiForm.controls[key].setValue(data.data[key]);
                } else {
                    this.ioiForm.addControl(key, new FormControl(data.data[key]));
                }
            }
        }
    }

    /**
     * TODO : split method
     */
    ngOnInit() {
        this.restCounterPartyService.getRecords(AppType.Broker).then(
            (data) => { this.parties = data; }
        );
        this.inputRules = this.inputRulesService.create();
        this.restInputRulesService.getRules("all").then((rules) => {
            this.inputRules.addAllRules(rules);
            if ((!this.data.data) || (!this.data.data.IOIid)) {
                this.inicialized = true;
            } else {
                for (const key in this.data.data) {
                    if (this.data.data.hasOwnProperty(key)) {
                        if (this.ioiForm.controls.hasOwnProperty(key)) {
                            this.ioiForm.controls[key].setValue(this.data.data[key]);
                        } else {
                            this.ioiForm.addControl(key, new FormControl(this.data.data[key]));
                        }
                    }
                }
                this.inicialized = true;
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
        this.formSub = this.ioiForm.statusChanges.subscribe((data) => {
            if (data === "INVALID") {
                this.isFormValid = false;
            } else {
                this.isFormValid = true;
            }
        });
    }


    public changeParty(evt) {
        const choosenParty = this.parties.filter(function (party) {
            return party.DeliveryToCompID === evt.value;
        })[0];
        if (choosenParty) {
            this.ioiForm.controls["ExDestination"].setValue(choosenParty.ExDestination);
        } else {
            this.ioiForm.controls["ExDestination"].setValue(undefined);
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnDestroy() {
        this.formSub.unsubscribe();
    }

}
