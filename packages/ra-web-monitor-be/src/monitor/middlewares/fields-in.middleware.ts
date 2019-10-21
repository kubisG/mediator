import { Injectable } from "@nestjs/common";
import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";

@Injectable()
export class FieldsInMiddleware implements MessageMiddleware {

    async resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        return data;
    }

}
