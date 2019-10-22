import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { Inject } from "@nestjs/common";
import { logMessage } from "@ra/web-core-be/dist/utils";
import { QueueService } from "../queue.service";

export class QueueMiddleware implements MessageMiddleware {

    constructor(
        @Inject("logger") private logger: Logger,
        private queueService: QueueService,
    ) { }

    async resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        this.logger.warn(`${context.id} QUEUING ${logMessage(data)}`);
        console.log("data", data);
        const result = this.queueService.addToQueue(data, context);

        console.log("QueueMiddleware result", result);
        if (result) {
            context.finish = false;
            return data;
        } else {
            this.logger.warn(`${context.id} QUEUING NEXT ${logMessage(data)}`);
            context.finish = true;
            return;
        }
    }

}
