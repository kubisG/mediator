import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { Injectable } from "@nestjs/common";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";

@Injectable()
export class PlacedMiddleware implements MessageMiddleware {

    resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        if ((data.msgType === MessageType.Order) && (!data.Placed)) {
            data.Placed = new Date().toISOString();
        }
        return data;
    }

}
