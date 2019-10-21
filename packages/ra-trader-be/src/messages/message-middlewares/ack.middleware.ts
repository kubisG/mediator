import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { Inject } from "@nestjs/common";
import { logMessage } from "@ra/web-core-be/dist/utils";

export class AckMiddleware implements MessageMiddleware {

    constructor(
        @Inject("logger") private logger: Logger,
    ) { }

    async resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        if (data.fields) {
            this.logger.warn(`${context.id} ACKING ${logMessage(data)}`);
            context.messageRouter.ack(data);
        }
        return data;
    }

}
