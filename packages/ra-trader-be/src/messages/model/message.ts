import { MessageValidatorService } from "@ra/web-core-be/dist/validators/message-validator.service";
import { OrdStatus } from "@ra/web-core-be/dist/enums/ord-status.enum";

export class Message {

    protected data: any = {};
    protected messageValidatorService: MessageValidatorService;

    constructor(
        data: any,
        messageValidatorService: MessageValidatorService,
    ) {
        this.data = data;
        this.messageValidatorService = messageValidatorService;
    }

    public reset() {
        if (!this.data.RaID) {
            this.data.RaID = this.data.OrgClOrdID ? this.data.OrgClOrdID : this.data.ClOrdID;
        }
        this.data.user = (!this.data.user) ? this.data.userId : this.data.user;
        this.data.TransactTime = (!this.data.TransactTime) ? new Date().toISOString() : this.data.TransactTime;
    }

    public setBasics(fastRandom: any) {
        this.data.ClOrdID = this.data.ClOrdID && this.data.ClOrdID !== null ? this.data.ClOrdID : `${fastRandom.nextInt()}`;
        this.data.OrderID = this.data.OrderID && this.data.OrderID !== null ? this.data.OrderID : `ORD${fastRandom.nextInt()}`;
        if (!this.data.RaID) {
            this.data.RaID = this.data.ClOrdID;
        }
    }

    public getCompIdFromDeliverToCompID() {
        return this.data.DeliverToCompID.split("_")[1];
    }

    public getMsgType() {
        return this.data.msgType;
    }

    public getExecType() {
        return this.data.ExecType;
    }

    public getOrderQty() {
        return this.data.OrderQty;
    }

    public getOrdStatus() {
        return this.data.OrdStatus;
    }

    public getRaID() {
        return this.data.RaID;
    }

    public getOrdId() {
        return this.data.OrgClOrdID ? this.data.OrgClOrdID : this.data.ClOrdID;
    }

    public getUser() {
        return (!this.data.user) ? this.data.userId : this.data.user;
    }

    public getTransactTime() {
        return (!this.data.TransactTime) ? new Date().toISOString() : this.data.TransactTime;
    }

    public isSaved() {
        return !this.data.notSave || this.data.notSave === false;
    }

    public getSenderCompID() {
        return this.data.SenderCompID;
    }

    public getTargetCompID() {
        return this.data.TargetCompID;
    }

    public getDeliverToCompID() {
        return this.data.DeliverToCompID;
    }

    public getOnBehalfOfCompID() {
        return this.data.OnBehalfOfCompID;
    }

    public getClOrdLinkID() {
        return this.data.ClOrdLinkID;
    }

    public getData() {
        return this.data;
    }

    public getByKey(key: string) {
        return this.data[key];
    }

    public getSpecType() {
        return this.data.specType;
    }

    public setValue(key: string, value: any) {
        return this.data[key] = value;
    }

    public async getJSONAsync(validate: boolean = false) {
        if (validate) {
            return await this.messageValidatorService.treatMessage({ ...this.data });
        }
        return { ...this.data };
    }

    public getJSON() {
        return { ...this.data };
    }

}
