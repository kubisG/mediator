import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { logMessage, parseCompanyId } from "@ra/web-core-be/dist/utils";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";
import { Inject } from "@nestjs/common";
import { SpecType } from "@ra/web-core-be/dist/enums/spec-type.enum";
import { BrokerAccept } from "../broker-accept";
import { BrokerService } from "../broker.service";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { Apps } from "@ra/web-core-be/dist/enums/apps.enum";
import { OrdStatus } from "@ra/web-core-be/dist/enums/ord-status.enum";

export class AcceptPhoneMessageMiddleware implements MessageMiddleware {

    constructor(
        @Inject("logger") private logger: Logger,
        private orderAccept: BrokerAccept,
        private authService: AuthService,
        @Inject("brokerOrderService") private brokerService: BrokerService,
    ) { }

    async resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        this.logger.info(`${context.id} Accept PHONE MESSAGE: '${logMessage(data)}'`);
        if ((data.specType === SpecType.phone) &&
            (data.msgType === MessageType.Replace || data.msgType === MessageType.Order || data.msgType === MessageType.Cancel)) {
            const result = this.orderAccept.accept(data, context);
            result.OrdStatus = (result.OrdStatus === OrdStatus.PendingReplace) ? OrdStatus.New : result.OrdStatus;
            const userData = this.authService.createDummyToken(parseCompanyId(context.queue), null, Apps.broker);
            this.brokerService.sendOrderMessage(result, userData);
        }
        return data;
    }
}
