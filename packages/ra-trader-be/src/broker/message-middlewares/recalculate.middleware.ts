import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { Injectable, Inject } from "@nestjs/common";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { OrdStatus } from "@ra/web-core-be/dist/enums/ord-status.enum";
import { ExecType } from "@ra/web-core-be/dist/enums/exec-type.enum";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";
import { OrderStoreRepository } from "../../dao/repositories/order-store.repository";
import { MessageRepository } from "../../dao/repositories/message.repository";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { logMessage } from "@ra/web-core-be/dist/utils";

@Injectable()
export class RecalculateMiddleware implements MessageMiddleware {

    private exeptionsOrdStatus = [
        OrdStatus.PendingReplace,
    ];

    constructor(
        @Inject("orderStoreRepository") private orderStoreRepository: OrderStoreRepository,
        @Inject("messageRepository") private messageRepository: MessageRepository,
        @Inject("logger") private logger: Logger,
    ) { }

    private async replaceLeavesQty(data: any, context: any) {
        if ((data.msgType === MessageType.Execution) && (data.ExecType === ExecType.Replace)) {
            this.logger.info(`${context.id} REPLACE QTY MESSAGE: '${logMessage(data)}'`);
            const messages = await this.messageRepository.find({
                where: { RaID: data.RaID, app: context.app }  // , company: context.userData.compId , company: parseCompanyId(context.queue)
                , order: { id: "DESC" }
            });
            for (let i = 0; i < messages.length; i++) {
                if (!(this.exeptionsOrdStatus.indexOf(<any>messages[i].OrdStatus) > -1)) {

                    data.CumQty = messages[i].CumQty ? messages[i].CumQty : 0;
                    data.AvgPx = messages[i].AvgPx ? messages[i].AvgPx : 0;
                    // disabled stopx px and price have to be set to 0
                    if (messages[i].StopPx && messages[i].StopPx > 0 && !data.StopPx) {
                        data.StopPx = 0;
                    }
                    if (messages[i].Price && messages[i].Price > 0 && !data.Price) {
                        data.Price = 0;
                    }
                    if (data.CumQty > data.OrderQty) {
                        data.LeavesQty = 0;
                        data.OrderQty = data.CumQty;
                    } else {
                        data.LeavesQty = data.OrderQty - data.CumQty;
                    }
                    if (data.CumQty === 0) {
                        data.OrdStatus = OrdStatus.New;
                    } else if (data.LeavesQty === 0) {
                        data.OrdStatus = OrdStatus.Filled;
                    } else if (data.LeavesQty > 0) {
                        data.OrdStatus = OrdStatus.PartiallyFilled;
                    }
                    data.app = context.app;
                    await this.orderStoreRepository.update({
                        RaID: data.RaID,
                        app: context.app // , company: <any>parseCompanyId(context.queue)
                    }, data);
                    this.logger.info(`${context.id} FINAL REPLACE QTY MESSAGE: '${logMessage(data)}'`);
                    return data;
                }
            }
        }
        return data;
    }

    async resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        data = await this.replaceLeavesQty(data, context);
        return data;
    }
}
