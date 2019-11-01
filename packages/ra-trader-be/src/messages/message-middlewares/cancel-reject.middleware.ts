import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { Injectable } from "@nestjs/common";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { OrdStatus } from "@ra/web-core-be/dist/enums/ord-status.enum";
import { ExecType } from "@ra/web-core-be/dist/enums/exec-type.enum";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";

@Injectable()
export class CancelRejectMiddleware implements MessageMiddleware {

    resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        if (data.msgType === MessageType.OrderCancelReject) {
            switch (data.OrdStatus) {
                case OrdStatus.PartiallyFilled: {
                    data.ExecType = ExecType.PartialFill;
                    break;
                }
                case OrdStatus.Filled: {
                    data.ExecType = ExecType.Fill;
                    break;
                }
                default: {
                    data.ExecType = data.OrdStatus;
                    break;
                }
            }
            return data;
        }
        return data;
    }
}
