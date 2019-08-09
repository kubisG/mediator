import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { InputRulesService } from "../../input-rules/input-rules.service";
import { RestInputRulesService } from "../../rest/rest-input-rules.service";
import { InputRules } from "../../input-rules/input-rules";
import { MessageFactoryService } from "../../orders/message-factory.service";
import { BrokerStoreService } from "../order-store/broker-store.service";
import { OrderStatusService } from "../../orders/order-status.service";
import { FillService } from "../fill.service";

@Component({
    selector: "ra-broker-fill-report",
    templateUrl: "./fill-report.component.html",
    styleUrls: ["./fill-report.component.less"]
})
export class FillReportComponent implements OnInit {

    public confirmedWarning = false;

    public fillForm: FormGroup = new FormGroup({
        qtyForFill: new FormControl("", [Validators.required]),
        pxForFill: new FormControl("", [Validators.required]),
        LastMkt: new FormControl(),
        LastCapacity: new FormControl(),
        LastLiquidityInd: new FormControl(),
    });

    public inputRules: InputRules;
    public inicialized = false;
    public disabled = false;
    public _order;
    public qtyMax = 0;

    public qtyPlaceholder = "Qty for this fill";

    @Input() set order(ord) {
        if (!ord) {
            this.fillForm.disable();
            this.disabled = true;
        } else {
            this.setForm(ord);
        }
    }

    @Output() action: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        public inputRulesService: InputRulesService,
        private restInputRulesService: RestInputRulesService,
        private messageFactoryService: MessageFactoryService,
        public orderStoreService: BrokerStoreService,
        private orderStatusService: OrderStatusService,
        private fillService: FillService,
    ) { }

    private setForm(ord) {
        this.fillForm.enable();
        this._order = ord;
        this.disabled = false;
        this.setQtyValidator(ord);
        this.setPriceValidator(ord);
    }

    private getInputRules() {
        this.inputRules = this.inputRulesService.create();
        this.restInputRulesService.getRules("all").then((data) => {
            this.inputRules.addAllRules(data);
            this.inicialized = true;
        });
    }

    private setQtyValidator(msg: any) {
        this.qtyMax = (msg.LeavesQty || msg.LeavesQty === 0) ? msg.LeavesQty : msg.OrderQty;
        this.qtyPlaceholder = "Qty for this fill max. " + this.qtyMax;
        const qtyControl = this.fillForm.controls["qtyForFill"];
        qtyControl.setValidators([Validators.required, Validators.max(Number(this.qtyMax)), Validators.min(1)]);
        qtyControl.markAsTouched();
    }

    private setPriceValidator(msg: any) {
        const pxForFill = this.fillForm.controls["pxForFill"];
        pxForFill.setValidators([Validators.required, (control: FormControl) => {
            control.markAsTouched();
            if (!this.fillService.distanceOk(msg, control.value)) {
                return { distance: "> 5% off last fill Px" };
            }
            if (!this.fillService.sideOk(msg, control.value)) {
                return { side: "Wrong side of limit" };
            }
            return null;
        }]);
    }

    public sendFill() {
        this.disabled = true;
        const result = this.messageFactoryService.fill(this._order, this.fillForm.value);
        this.setQtyValidator(result);
        this.setPriceValidator(result);
        this.orderStoreService.sendMessage(result);
        this.fillForm.reset();
        this.action.emit();
    }

    public ngOnInit(): void {
        this.getInputRules();
    }

    canFill() {
        if (this._order) {
            return this.orderStatusService.canFill(this._order);
        }
        return false;
    }

    public confirmEvent(evt) {
        this.confirmedWarning = evt.checked;
    }
}
