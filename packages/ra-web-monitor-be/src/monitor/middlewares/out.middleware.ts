import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";
import { Inject, Injectable } from "@nestjs/common";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
@Injectable()
export class OutMiddleware implements MessageMiddleware {

    constructor(
        @Inject("logger") private logger: Logger,
    ) { }

    resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        this.logger.info(`OUT MIDDLEWARE: ${JSON.stringify(data)}...`);
        return data;
    }

}
