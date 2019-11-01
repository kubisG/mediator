import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { logMessage, parseCompanyId } from "@ra/web-core-be/dist/utils";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";
import { Inject } from "@nestjs/common";
import { BrokerService } from "../broker.service";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { ExecutionReport } from "../../broker/messages/execution-report";
import { ExecType } from "@ra/web-core-be/dist/enums/exec-type.enum";
import { ExecTransType } from "@ra/web-core-be/dist/enums/exec-trans-type.enum";
import { LightMapper } from "light-mapper";
import { Apps } from "@ra/web-core-be/dist/enums/apps.enum";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";

export class AcceptNewMessageMiddleware implements MessageMiddleware {

    constructor(
        @Inject("logger") private logger: Logger,
        @Inject("fastRandom") private fastRandom: any,
        private authService: AuthService,
        @Inject("brokerOrderService") private brokerService: BrokerService,
    ) { }

    async resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        this.logger.info(`${context.id} Accept NEW MESSAGE: '${logMessage(data)}'`);
        if (data.msgType === MessageType.Order) {
            const result = this.createResponse(data);
            if (result && result !== null) {
                const userData = this.authService.createDummyToken(parseCompanyId(context.queue), null, Apps.broker);
                await this.brokerService.sendOrderMessage(result, userData);
            }
        }
        return data;
    }

    private createExecutionReport(msg: any) {
        const mapper = new LightMapper();
        // const raId = msg.OrgClOrdID ? msg.OrgClOrdID : msg.ClOrdID;
        // TODO : temp sol., should be saved in broker too
        const raId = msg.RaID;
        const target = msg.OnBehalfOfCompID;
        const sender = msg.DeliverToCompID;
        const report = mapper
            .map<ExecutionReport>(ExecutionReport, msg);
        // TODO : temp sol.
        report.ClOrdID = msg.ClOrdID;
        report.AvgPx = 0;
        report.CumQty = 0;
        report.LastQty = 0;
        report.LastPx = 0;
        report.OrderID = report.OrderID && report.OrderID !== null ? report.OrderID : `ORD${this.fastRandom.nextInt()}`;
        report.ExecID = `EX${this.fastRandom.nextInt()}`;
        report.ExecType = ExecType.PendingNew;
        report.RaID = raId;
        report.ExecTransType = ExecTransType.New;
        report.msgType = MessageType.Execution;
        report.LeavesQty = msg.OrderQty;
        report.SecurityType = "CS";
        report.TargetCompID = target; // msg.SenderCompID;
        report.SenderCompID = sender;
        report.RequestType = "Broker";
        report.RequestType = "Broker";
        return report;
    }

    private createResponse(msg: any) {
        switch (msg.msgType) {
            case MessageType.Order: {
                return this.createExecutionReport(msg);
            }
            default: {
                return null;
            }
        }
    }

}
