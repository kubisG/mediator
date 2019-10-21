import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { Injectable } from "@nestjs/common";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";

@Injectable()
export class TransactTimeMiddleware implements MessageMiddleware {

    resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        data.TransactTime = new Date().toISOString();
        return data;
    }

}
