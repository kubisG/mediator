import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { Injectable, Inject } from "@nestjs/common";
import { ExecType } from "@ra/web-core-be/dist/enums/exec-type.enum";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";
import { MessageRepository } from "../../dao/repositories/message.repository";

@Injectable()
export class CancelFillMiddleware implements MessageMiddleware {

    constructor(
        @Inject("messageRepository") private messageRepository: MessageRepository,
    ) { }

    async resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        if (data.ExecType === ExecType.TradeCancel) {
            await this.messageRepository.update({ ExecID: data.ExecRefID, app: 0 }, { Canceled: "Y" });
        }
        return data;
    }

}
