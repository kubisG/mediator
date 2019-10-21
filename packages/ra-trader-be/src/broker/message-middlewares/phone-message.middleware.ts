import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { logMessage } from "@ra/web-core-be/dist/utils";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";
import { Inject } from "@nestjs/common";
import { SpecType } from "@ra/web-core-be/dist/enums/spec-type.enum";
import { PhoneService } from "../../orders/phone.service";

export class PhoneMessageMiddleware implements MessageMiddleware {

    constructor(
        @Inject("logger") private logger: Logger,
        private phoneService: PhoneService,
    ) { }

    async resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        this.logger.info(`${context.id} PHONE MESSAGE: '${logMessage(data)}' (${data.specType})`);
        if (data.specType === SpecType.phone) {
            this.phoneService.sendBrokerMsg({ ...data }, context.userData);
        }
        return data;
    }
}
