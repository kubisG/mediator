import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { Injectable, Inject } from "@nestjs/common";
import { OrderStatusPriority } from "../order-status-priority";
import { ExecType } from "@ra/web-core-be/dist/enums/exec-type.enum";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { OrdStatus } from "@ra/web-core-be/dist/enums/ord-status.enum";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";
import { OrderStoreRepository } from "../../dao/repositories/order-store.repository";
import { MessageRepository } from "../../dao/repositories/message.repository";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { logMessage } from "@ra/web-core-be/dist/utils";

@Injectable()
export class OrderStatusMiddleware implements MessageMiddleware {

    private orderStatusPriority: OrderStatusPriority = new OrderStatusPriority();

    private exeptionsExecType = [
        ExecType.Replace,
        ExecType.Rejected,
        ExecType.Canceled,
        ExecType.TradeCancel,
    ];

    private exeptionsMsgType = [
        MessageType.OrderCancelReject,
    ];

    private exeptionsOrdStatus = [
        OrdStatus.PendingReplace,
        OrdStatus.PendingCancel,
    ];

    constructor(
        @Inject("orderStoreRepository") private orderStoreRepository: OrderStoreRepository,
        @Inject("messageRepository") private messageRepository: MessageRepository,
        @Inject("logger") private logger: Logger,
    ) { }

    private async setStatus(data: any, context: any) {
        if (this.exeptionsExecType.indexOf(data.ExecType) > -1) {
            return data;
        }
        const messages = await this.messageRepository.find({
            where: { RaID: data.RaID, app: context.app }
            , order: { id: "DESC" },
        });
        this.logger.warn(`${context.id} STATUS ${logMessage(data)}`);
        if (messages.length > 0) {
            if (this.exeptionsMsgType.indexOf(data.msgType) > -1) {
                for (const mess of messages) {
                    if (!(this.exeptionsOrdStatus.indexOf(mess.OrdStatus as any) > -1)) {
                        data.OrdStatus = mess.OrdStatus;
                        break;
                    }
                }
                return data;
            }
            const ordStatus = this.orderStatusPriority.getHeavierStatus(data, messages[0]);
            this.logger.warn(`${context.id} STATUS ${ordStatus} - ${data.OrdStatus}`);
            if ((ordStatus) && (ordStatus !== data.OrdStatus)) {
                data.disableStatusUpdate = true;
                await this.orderStoreRepository.update({
                    RaID: data.RaID,
                    app: context.app,
                }, { OrdStatus: ordStatus });
            }
        }
        this.logger.warn(`${context.id} FINAL STATUS ${logMessage(data)}`);
        return data;
    }

    async resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        this.logger.warn(`${context.id} OrderStatusMiddleware ${logMessage(data)}`);
        data = await this.setStatus(data, context);

        return data;
    }

}
