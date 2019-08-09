import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { InputRules } from "../../input-rules/input-rules";
import { InputRulesService } from "../../input-rules/input-rules.service";
import { RestInputRulesService } from "../../rest/rest-input-rules.service";
import { OrderStatusService } from "../../orders/order-status.service";
import { MessageFactoryService } from "../../orders/message-factory.service";
import { BrokerStoreService } from "../order-store/broker-store.service";
import { ExecType, AppType } from "@ra/web-shared-fe";
import { RestCounterPartyService } from "../../rest/rest-counter-party.service";

@Component({
    selector: "ra-broker-commission-details",
    templateUrl: "./commission-details.component.html",
    styleUrls: ["./commission-details.component.less"]
})
export class CommissionDetailsComponent implements OnInit {

    public commissionForm: FormGroup = new FormGroup({
        CommType: new FormControl(),
        Commission: new FormControl(),
    });

    public inputRules: InputRules;
    public counterParties;
    public inicialized = false;
    public disabled = true;
    public disabledSelect = false;

    public _order;

    @Input() set order(ord) {
        if (!ord) {
            this.commissionForm.disable();
            this.disabledSelect = true;
        } else {
            this._order = ord;
            this.formAccess(ord);
            this.disabled = false;
        }
    }

    @Output() action: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        public inputRulesService: InputRulesService,
        private restInputRulesService: RestInputRulesService,
        private restCounterPartyService: RestCounterPartyService,
        private orderStatusService: OrderStatusService,
        private messageFactoryService: MessageFactoryService,
        public orderStoreService: BrokerStoreService,
    ) { }

    private formAccess(ord) {
        if (ord.ExecType === ExecType.Fill || ord.ExecType === ExecType.PartialFill || ord.ExecType === ExecType.Trade) {
            this.commissionForm.enable();
            this.setCommission();
            this.disabled = false;
            this.disabledSelect = false;
        } else {
            this.commissionForm.disable();
            this.disabled = true;
            this.disabledSelect = true;
        }
    }

    private getInputRules() {
        this.inputRules = this.inputRulesService.create();
        this.restInputRulesService.getRules("all").then((data) => {
            this.inputRules.addAllRules(data);
            this.getCounterParties();
        });
    }

    private setCommission() {
        const party = this.findParty(this._order);
        if (party && party.length > 0) {
            this.commissionForm.controls["Commission"].setValue(party[0].Commission);
            this.commissionForm.controls["CommType"].setValue(party[0].CommType);
        }
    }

    private getCounterParties() {
        this.restCounterPartyService.getRecords(AppType.Trader).then(
            (data) => {
                this.counterParties = data;
                this.setCommission();
                this.inicialized = true;
            }
        );
    }

    private findParty(data): any {
        if (this.counterParties) {
            return this.counterParties.filter((party) => {
                return party.DeliveryToCompID === data.OnBehalfOfCompID;
            });
        } else {
            return null;
        }
    }

    public ngOnInit(): void {
        this.getInputRules();
    }

    canCancel() {
        if (this._order) {
            return this.orderStatusService.canCancel(this._order);
        }
        return false;
    }

    canDFD() {
        if (this._order) {
            return this.orderStatusService.canDFD(this._order);
        }
        return false;
    }

    canAccept() {
        if (this._order) {
            return this.orderStatusService.canAccept(this._order);
        }
        return false;
    }

    canReject() {
        if (this._order) {
            return this.orderStatusService.canReject(this._order);
        }
        return false;
    }

    canBust() {
        if (this._order) {
            return this.orderStatusService.canBust(this._order);
        }
        return false;
    }

    cancel() {
        this.disabled = true;
        const msg = this.messageFactoryService.cancel(this._order);
        this.orderStoreService.sendMessage(msg);
        this.action.emit();
    }

    dfd() {
        this.disabled = true;
        const commission = this.commissionForm.enabled ? this.commissionForm.value : undefined;
        const msg = this.messageFactoryService.dfd(this._order, commission);
        this.orderStoreService.sendMessage(msg);
        this.action.emit();
    }

}
