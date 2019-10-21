import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { logMessage } from "@ra/web-core-be/dist/utils";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";
import { Inject } from "@nestjs/common";
import { AckMiddleware } from "./ack.middleware";

export class ResendMessageMiddleware implements MessageMiddleware {

    constructor(
        @Inject("logger") private logger: Logger,
    ) { }

    async resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        this.logger.info(`RESEND MESSAGE: '${logMessage(data)}' TO QUEUE: ${context.resendQueue}`);
        context.messageRouter.sendToQueue({ ...data, runMid: [AckMiddleware.name] }, context.resendQueue);
        return data;
    }
}
