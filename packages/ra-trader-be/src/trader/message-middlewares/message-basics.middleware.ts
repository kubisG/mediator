import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { Injectable, Inject } from "@nestjs/common";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";

@Injectable()
export class MessageBasicsMiddleware implements MessageMiddleware {

    constructor(
        @Inject("fastRandom") private fastRandom: any,
    ) { }

    async resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        data.ClOrdID = data.ClOrdID && data.ClOrdID !== null ? data.ClOrdID : `${this.fastRandom.nextInt()}`;
        data.OrderID = data.OrderID && data.OrderID !== null ? data.OrderID : `ORD${this.fastRandom.nextInt()}`;
        if (!data.RaID) {
            data.RaID = data.ClOrdID;
        }
        return data;
    }

}
