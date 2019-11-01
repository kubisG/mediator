
import { AcceptNew } from "./messages/accept-new";
import { ExecTransType } from "@ra/web-core-be/dist/enums/exec-trans-type.enum";
import { OrdStatus } from "@ra/web-core-be/dist/enums/ord-status.enum";
import { ExecType } from "@ra/web-core-be/dist/enums/exec-type.enum";
import { LightMapper } from "light-mapper";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { Inject } from "@nestjs/common";
import { Reject } from "./messages/reject";
import { CxlRejResponseTo } from "@ra/web-core-be/dist/enums/cxl-rej-response-to.enum";
import { ExecutionReport } from "./messages/execution-report";

export class BrokerReject {

    private fastRandom: any;

    constructor(
        @Inject("fastRandom") fastRandom: any,
    ) {
        this.fastRandom = fastRandom;
    }

    public reject(message: any, context: any) {
        const mapper = new LightMapper();
        const sender = message.OnBehalfOfCompID; // SenderCompID
        let result;
        if (message.OrdStatus === OrdStatus.PendingReplace) {
            result = mapper
                .map<Reject>(Reject, message);
            result.OrdStatus = OrdStatus.Rejected;
            result.msgType = MessageType.OrderCancelReject;
            result.CxlRejResponseTo = CxlRejResponseTo.OrderCancelReplaceRequest;
            result.CxlRejReason = "BrokerCredit";
        } else if (message.OrdStatus === OrdStatus.PendingCancel) {
            result = mapper
                .map<Reject>(Reject, message);
            result.OrdStatus = OrdStatus.Rejected;
            result.msgType = MessageType.OrderCancelReject;
            result.CxlRejResponseTo = CxlRejResponseTo.OrderCancelRequest;
            result.CxlRejReason = "BrokerCredit";
        } else {
            result = mapper
                .map<ExecutionReport>(ExecutionReport, message);
            result.OrdRejReason = "BrokerCredit";
            result.msgType = MessageType.Execution;
            result.ExecType = ExecType.Rejected;
            result.OrdStatus = OrdStatus.Rejected;
            result.AvgPx = 0;
            result.CumQty = 0;
            result.LastQty = 0;
            result.LastPx = 0;
            result.SecurityType = message.SecurityType ? message.SecurityType : "CS";
            result.OrderID = result.OrderID && result.OrderID !== null ? result.OrderID : `ORD${this.fastRandom.nextInt()}`;
            result.ExecID = `EX${this.fastRandom.nextInt()}`;
            result.ExecTransType = ExecTransType.New;
            result.LeavesQty = result.LeavesQty ? result.LeavesQty : result.OrderQty;
        }
        result.RequestType = "Broker";
        result.SenderCompID = context.queue ? context.queue : context.userData.compQueueBroker;
        result.TargetCompID = sender;
        result.TransactTime = new Date().toISOString();
        return result;
    }
}
