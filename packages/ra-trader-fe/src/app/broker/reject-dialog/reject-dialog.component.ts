import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { InputRulesService } from "../../input-rules/input-rules.service";
import { RestInputRulesService } from "../../rest/rest-input-rules.service";
import { InputRules } from "../../input-rules/input-rules";
import { FormGroup, FormControl } from "@angular/forms";
import { OrderStatus } from "../../orders/order-status";
import { MessageFactoryService } from "../../orders/message-factory.service";
import { BrokerStoreService } from "../order-store/broker-store.service";
import { MessageType } from "@ra/web-shared-fe";
import { CxlRejResponseTo } from "@ra/web-shared-fe";
import { ExecType } from "@ra/web-shared-fe";
import { OrdStatus } from "@ra/web-shared-fe";

@Component({
    selector: "ra-broker-reject-dialog",
    templateUrl: "./reject-dialog.component.html",
    styleUrls: ["./reject-dialog.component.less"]
})
export class RejectDialogComponent implements OnInit, OnDestroy {

    public inputRules: InputRules;
    public inicialized = false;
    public disabled = false;

    public rejectForm: FormGroup = new FormGroup({
        OrdRejReason: new FormControl(),
    });

    public rejectValue = "";
    public isFormValid = false;

    public ordersMessages: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<RejectDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public inputRulesService: InputRulesService,
        private restInputRulesService: RestInputRulesService,
        private messageFactoryService: MessageFactoryService,
        private orderStoreService: BrokerStoreService,
    ) {

    }

    private getInputRules() {
        this.inputRules = this.inputRulesService.create();
        this.restInputRulesService.getRules("all").then((data) => {
            this.inputRules.addAllRules(data);
            this.inicialized = true;
        });
    }

    private initRejectValue() {
        switch (this.data.OrdStatus) {
            case OrderStatus.PendingCancel: {
                this.rejectValue = "cancel";
                break;
            }
            case OrderStatus.PendingReplace: {
                // cancel replace have same options like cancel new
                this.rejectValue = "new";
                break;
            }
            case OrderStatus.PendingNew: {
                this.rejectValue = "new";
                break;
            }
        }
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

    private setOrderStatus(message: any, ordersMessages: any[]) {
        if (ordersMessages.length > 1) {
            message.OrdStatus = ordersMessages[ordersMessages.length - 2].OrdStatus;
        }
    }

    private sendReplaceCancel() {
        this.orderStoreService.getMessages(this.data.RaID).then((result) => {
            this.ordersMessages = result;
            const message = this.messageFactoryService.reject({
                ...this.data,
                ...this.rejectForm.value
            });
            this.setOrderStatus(message, this.ordersMessages);
            message.ClOrdID = this.data.replaceMessage.ClOrdID;
            message.OrigClOrdID = this.data.replaceMessage.OrigClOrdID;
            message.msgType = MessageType.OrderCancelReject;
            message.CxlRejResponseTo = CxlRejResponseTo.OrderCancelReplaceRequest;
            message.CxlRejReason = message.OrdRejReason;
            message.OrdRejReason = null;
            this.dialogRef.close(message);
        });
    }

    private sendFillOrCancel() {
        this.orderStoreService.getMessages(this.data.RaID).then((result) => {
            this.ordersMessages = result;
            const message = this.messageFactoryService.reject({
                ...this.data,
                ...this.rejectForm.value
            });
            this.setOrderStatus(message, this.ordersMessages);
            message.msgType = MessageType.OrderCancelReject;
            message.CxlRejResponseTo = CxlRejResponseTo.OrderCancelRequest;
            message.CxlRejReason = message.OrdRejReason;
            message.OrdRejReason = null;
            (message as any).ExecType = null;
            this.dialogRef.close(message);
        });
    }


    private sendOrderCancel() {
        const message = this.messageFactoryService.accept({
            ...this.data
        });
        (message as any).OrdRejReason = this.rejectForm.controls["OrdRejReason"].value;
        (message as any).ExecType = ExecType.Rejected;
        (message as any).OrdStatus = OrdStatus.Rejected;
        this.dialogRef.close(message);
    }

    private rejectMessage() {
        switch (this.data.OrdStatus) {
            case OrderStatus.PendingReplace: {
                this.sendReplaceCancel();
                break;
            }
            case OrderStatus.PendingCancel: {
                this.sendFillOrCancel();
                break;
            }
            default: {
                this.sendOrderCancel();
                break;
            }
        }
    }

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public send() {
        this.disabled = true;
        this.rejectMessage();
    }

    public ngOnDestroy(): void {

    }

    public ngOnInit(): void {
        this.getInputRules();
        this.initRejectValue();
        this.subscribeForm();
    }

}
