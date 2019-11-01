
import { AcceptNew } from "../broker/messages/accept-new";
import { ExecTransType } from "@ra/web-core-be/dist/enums/exec-trans-type.enum";
import { OrdStatus } from "@ra/web-core-be/dist/enums/ord-status.enum";
import { ExecType } from "@ra/web-core-be/dist/enums/exec-type.enum";
import { LightMapper } from "light-mapper";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { Inject } from "@nestjs/common";
import { parseCompanyId } from "@ra/web-core-be/dist/utils";

export class BrokerAccept {

    private fastRandom: any;

    constructor(
        @Inject("fastRandom") fastRandom: any,
    ) {
        this.fastRandom = fastRandom;
    }

    private getAcceptOrdStatus(message: any) {
        switch (message.OrdStatus) {
            case OrdStatus.PendingCancel: {
                return OrdStatus.Canceled;
            }
            case OrdStatus.PendingNew: {
                return OrdStatus.New;
            }
            case OrdStatus.PendingReplace: {
                return message.OrdStatus;
            }
            default: {
                // TODO : throw exception
                return message.OrdStatus;
            }
        }
    }

    private getAcceptExecType(message: any) {
        switch (message.OrdStatus) {
            case OrdStatus.PendingCancel: {
                return ExecType.Canceled;
            }
            case OrdStatus.PendingNew: {
                return ExecType.New;
            }
            case OrdStatus.PendingReplace: {
                return ExecType.Replace;
            }
            default: {
                // TODO : throw exception
                return message.ExecType;
            }
        }
    }

    public accept(message: any, context: any) {
        const mapper = new LightMapper();
        const target = message.OnBehalfOfCompID; // SenderCompID

        let result = null as AcceptNew;
        if (message.OrdStatus === OrdStatus.PendingReplace) {
            result = mapper
                .map<AcceptNew>(AcceptNew, message);
            result.LastQty = 0;
            result.LastPx = 0;
            result.LeavesQty = result.LeavesQty ? result.LeavesQty : result.OrderQty;
        } else if (message.OrdStatus === OrdStatus.PendingCancel) {
            result = mapper
                .map<AcceptNew>(AcceptNew, message);
            result.LastQty = 0;
            result.LastPx = 0;
            result.LeavesQty = 0;
        } else {
            result = mapper
                .map<AcceptNew>(AcceptNew, message);
            result.AvgPx = 0;
            result.CumQty = 0;
            result.LastQty = 0;
            result.LastPx = 0;
            result.LeavesQty = result.LeavesQty ? result.LeavesQty : result.OrderQty;
        }
        result.msgType = MessageType.Execution;
        result.SecurityType = message.SecurityType ? message.SecurityType : "CS";
        result.RequestType = "Broker";
        result.SenderCompID = context.queue ? context.queue : context.userData.compQueueBroker;
        result.TargetCompID = target;
        result.TransactTime = new Date().toISOString();
        result.OrdStatus = this.getAcceptOrdStatus(message);
        result.OrderID = result.OrderID && result.OrderID !== null ? result.OrderID : `ORD${this.fastRandom.nextInt()}`;
        result.ExecID = `EX${this.fastRandom.nextInt()}`;
        result.ExecType = this.getAcceptExecType(message);
        result.ExecTransType = ExecTransType.New;

        if (result.OrdStatus === OrdStatus.Canceled) {
            result.LeavesQty = 0;
        }
        result.company = Number(parseCompanyId(context.queue ? context.queue : context.userData.compQueueBroker));
        return result;
    }
}
