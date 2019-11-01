import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { Injectable, Inject } from "@nestjs/common";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { BrokerService } from "../../broker/broker.service";
import { ExecType } from "@ra/web-core-be/dist/enums/exec-type.enum";
import { BrokerAccept } from "../../broker/broker-accept";
import { BrokerReject } from "../../broker/broker-reject";
import { MessageRepository } from "../../dao/repositories/message.repository";
import { logMessage } from "@ra/web-core-be/dist/utils";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";

@Injectable()
export class ReplaceTreeMiddleware implements MessageMiddleware {

    constructor(
        @Inject("messageRepository") private messageRepository: MessageRepository,
        @Inject("brokerOrderService") private brokerService: BrokerService,
        private orderAccept: BrokerAccept,
        private orderReject: BrokerReject,
        @Inject("logger") private logger: Logger,
    ) { }

    private async replaceTreeProcessing(data: any, context: any) {

        // still problem with rejecting, when rejected message should retrn to last known number or something
        // now im trying to return previous message
        if (context.userData && (
            (data.msgType === MessageType.OrderCancelReject) ||
            (data.msgType === MessageType.Execution && data.ExecType === ExecType.Replace)
            || (data.msgType === MessageType.Execution && data.ExecType === ExecType.Canceled)
        )
        ) {
            const messages = await this.messageRepository.getPendingMessages(data.RaID, data.OrigClOrdID, context.app);
            for (const message of messages) {
                let result = null;
                message["OnBehalfOfCompID"] = data.OnBehalfOfCompID;
                message["DeliverToCompID"] = data.DeliverToCompID;
                message["ClientID"] = data.ClientID;
                message["OrderID"] = data.OrderID;
                if (data.msgType === MessageType.OrderCancelReject) {
                    if (message.msgType === MessageType.Replace) {
                        data.replaceMessage = message;
                    }
                    result = this.orderReject.reject(message, context);
                } else if ((data.msgType === MessageType.Execution && data.ExecType === ExecType.Replace)
                    || (data.msgType === MessageType.Execution && data.ExecType === ExecType.Canceled)) {
                    result = this.orderAccept.accept(message, context);
                }
                if (result !== null) {
                    await this.brokerService.sendOrderMessage(result, context.userData);
                }

                break;
            }
        }
        return data;
    }

    async resolve(data: any, context: any): Promise<any> {
        this.logger.info(`${context.id} REPLACE TREE MESSAGE: '${logMessage(data)}'`);
        data = await this.replaceTreeProcessing(data, context);
        return data;
    }

}
