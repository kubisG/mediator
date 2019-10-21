import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { Inject } from "@nestjs/common";
import { logMessage } from "@ra/web-core-be/dist/utils";
import { QueueService } from "../queue.service";

export class DeQueueMiddleware implements MessageMiddleware {

    constructor(
        @Inject("logger") private logger: Logger,
        private queueService: QueueService,
    ) { }

    async resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        this.logger.warn(`${context.id} DEQUEUING ${logMessage(data)}`);
        return data;
        const next = this.queueService.runFromQueue(data, context);

        console.log("next", next);

        if (next) {
            this.logger.warn(`${context.id}  RESENDING NEXT ${logMessage(next.message)} TO ${next.context.side} - ${next.context.queue}`);
            if (next.context.side === "IN") {
                console.log("Internal");
                context.messageRouter.sendInternalMessage({ ...next.message }, next.context.nextQueue ?
                    next.context.nextQueue : next.context.queue);
            } else {
                console.log("External");
                context.messageRouter.sendUserMessage({ ...next.message }, next.context.userData,
                    next.context.resendQueue);
            }
        }
        return data;
    }

}
