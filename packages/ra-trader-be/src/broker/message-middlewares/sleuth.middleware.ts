import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";
import { Injectable } from "@nestjs/common";
import { BrokerService } from "../broker.service";
import { parseCompanyId } from "@ra/web-core-be/dist/utils";

@Injectable()
export class SleuthMiddleware implements MessageMiddleware {

    constructor(
        private brokerService: BrokerService,
    ) { }

    async resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        this.brokerService.checkSleuth(data, parseCompanyId(context.queue));
        return data;
    }

}
