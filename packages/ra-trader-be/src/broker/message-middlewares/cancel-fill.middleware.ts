import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { Inject } from "@nestjs/common";
import { ExecType } from "@ra/web-core-be/dist/enums/exec-type.enum";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { OrdStatus } from "@ra/web-core-be/dist/enums/ord-status.enum";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";
import { OrderStoreRepository } from "../../dao/repositories/order-store.repository";
import { MessageRepository } from "../../dao/repositories/message.repository";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { logMessage } from "@ra/web-core-be/dist/utils";

export class CancelFillMiddleware implements MessageMiddleware {

    constructor(
        @Inject("orderStoreRepository") private orderStoreRepository: OrderStoreRepository,
        @Inject("messageRepository") private messageRepository: MessageRepository,
        @Inject("logger") private logger: Logger,
    ) { }

    private async recalculateCanceledFill(data: any, context: any) {
        if (data.ExecType === ExecType.TradeCancel) {
            let refMessage;
            let lastMessage;
            const messages = await this.messageRepository.find({
                where: { RaID: data.RaID, app: context.app },
                order: { id: "ASC" },
            });
            for (const message of messages) {
                if (
                    message.OrdStatus.indexOf("Fill") > -1 &&
                    message.ExecID === data.ExecRefID &&
                    message.msgType === MessageType.Execution
                ) {
                    refMessage = message;
                }
                if (
                    message.OrdStatus.indexOf("Fill") > -1 &&
                    // message.ExecID !== data.ExecRefID &&
                    message.msgType === MessageType.Execution
                ) {
                    lastMessage = message;
                }
            }
            let avgPx = data.AvgPx;
            try {
                avgPx =  ((Number(lastMessage.AvgPx) * Number(lastMessage.CumQty))
                 - (Number(refMessage.LastQty) *  Number(refMessage.LastPx)))
                         / (Number(lastMessage.CumQty) - Number(refMessage.LastQty));
            } catch (ex) {
                this.logger.info(`AVG - CANCEL MESSAGE: '${logMessage(data)}'`);
                this.logger.error(ex);
            }
            data.AvgPx = avgPx;
            data.CumQty = Number(lastMessage.CumQty) - Number(refMessage.LastQty);
            data.LeavesQty = Number(lastMessage.LeavesQty) + Number(refMessage.LastQty);
            data.LastQty = 0;
            data.OrdStatus = data.CumQty === 0 ? OrdStatus.New : OrdStatus.PartiallyFilled;
            data.LastPx = 0;

            if (!context.queue) {
                data.app = context.app;
                await this.orderStoreRepository.update({ RaID: data.RaID, app: context.app }, data);
            }
        }
    }

    async resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        this.logger.info(`${context.id} CANCEL FILL MESSAGE: '${logMessage(data)}'`);
        try {
            await this.recalculateCanceledFill(data, context);
        } catch (ex) {

        }
        return data;
    }

}
