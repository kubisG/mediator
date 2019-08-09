
import { Component, Inject, OnInit, Optional, LOCALE_ID } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { BrokerAllocationsService } from "../allocations/borker-allocations.service";
import { AllocStatus } from "@ra/web-shared-fe";
import { InputRulesService } from "../../input-rules/input-rules.service";
import { RestInputRulesService } from "../../rest/rest-input-rules.service";
import { InputRules } from "../../input-rules/input-rules";
import { FormGroup, FormControl } from "@angular/forms";
import { formatDate } from "@angular/common";

@Component({
    selector: "ra-broker-allocation-dialog",
    templateUrl: "allocation-dialog.component.html",
    styleUrls: ["allocation-dialog.component.less"]
})
export class AllocationDialogComponent implements OnInit {

    public raId;
    public remainQty = 0;
    public sended = false;
    public AllocStatus = AllocStatus.New;
    public inputRules: InputRules;
    public inicialized = false;

    public rejectForm: FormGroup = new FormGroup({
        AllocRejCode: new FormControl(),
    });

    public rejectValue = "";
    public isFormValid = false;

    constructor(
        public dialogRef: MatDialogRef<AllocationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private allocationsService: BrokerAllocationsService,
        public inputRulesService: InputRulesService,
        private restInputRulesService: RestInputRulesService,
        @Inject(LOCALE_ID) private locale: string
    ) {
        if ((data) && (data.data)) {
            this.raId = data.data.RaID;
            this.AllocStatus = data.data.AllocStatus ? data.data.AllocStatus : "New";
            data.data.TransactTime = formatDate(data.data.TransactTime, "yyyy-MM-dd HH:mm:ss", this.locale);
            this.remainQty = this.data.data.CumQty;
        }
        this.getInputRules();
    }

    private getInputRules() {
        this.inputRules = this.inputRulesService.create();
        this.restInputRulesService.getRules("all").then((data) => {
            this.inputRules.addAllRules(data);
            this.inicialized = true;
        });
    }

    private subscribeForm() {
        this.rejectForm.statusChanges.subscribe((data) => {
            if (this.inicialized) {
                if (data === "INVALID") {
                    this.isFormValid = false;
                } else {
                    this.isFormValid = true;
                }
            }
        });
    }

    public ngOnInit(): void {
        this.subscribeForm();
    }

    showRemain(evt) {
        this.remainQty = this.data.data.CumQty - evt;
    }

    onSend(status) {
        const dataCopy = { ...this.data.data };
        if (status === "Reject") {
            dataCopy.AllocRejCode = this.rejectForm.value["AllocRejCode"];
        } else {
            dataCopy.AllocRejCode = null;
        }
        dataCopy.state = status;
        this.allocationsService.sendMessage(dataCopy);
        this.dialogRef.close(true);
    }

    onNoClick() {
        this.dialogRef.close();
    }
}
