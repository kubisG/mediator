import { SaveMessageMiddleware } from "../../messages/message-middlewares/save-message.middleware";
import { Inject } from "@nestjs/common";
import { Connection, Repository, UpdateResult, InsertResult } from "typeorm";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { CompanyRepository } from "../../dao/repositories/company.repository";
import { RaOrderStore } from "../../entity/ra-order-store";
import { RaMessage } from "../../entity/ra-message";
import { ExecType } from "@ra/web-core-be/dist/enums/exec-type.enum";

export class SaveMessageBrokerMiddleware extends SaveMessageMiddleware {

    constructor(
        @Inject("DbConnection") dbConnection: () => Connection,
        @Inject("logger") logger: Logger,
        @Inject("fastRandom") fastRandom: any,
        @Inject("companyRepository") companyRepository: CompanyRepository,
    ) {
        super(dbConnection, logger, fastRandom, companyRepository);
    }

    async beforeAll(
        data: any,
        context: any,
        raOrderStoreToken: Repository<RaOrderStore>,
        raMessageToken: Repository<RaMessage>) {
    }

    async beforeRaOrderUpdate(
        raOrder: RaOrderStore,
        data: any,
        context: any,
        raOrderStoreToken: Repository<RaOrderStore>,
        orderExist: RaOrderStore,
    ): Promise<any> {
        if (data.msgType === MessageType.OrderCancelReject) {
            raOrder = orderExist;
            raOrder.replaceMessage = null;
            raOrder.OrdStatus = data.OrdStatus;
        } else if ((data.msgType === MessageType.Execution) && (data.ExecType === ExecType.Replace)) {
            raOrder.replaceMessage = null;
        } else if (data.msgType === MessageType.Replace) {
            raOrder = orderExist;
            raOrder.replaceMessage = { ...data };
            raOrder.OrdStatus = data.OrdStatus;
        } else if (data.disableStatusUpdate) {
            raOrder.OrdStatus = orderExist.OrdStatus;
        }
        return raOrder;
    }

    afterRaOrderUpdate(
        raOrder: RaOrderStore,
        data: any, context: any,
        raOrderStoreToken: Repository<RaOrderStore>,
        raOrderUpdateResult: UpdateResult
    ) {

    }

    beforeRaOrderInsert(
        raOrder: RaOrderStore,
        data: any,
        context: any,
        raOrderStoreToken: Repository<RaOrderStore>
    ) {

    }

    afterRaOrderInsert(
        raOrder: RaOrderStore,
        data: any, context: any,
        raOrderStoreToken: Repository<RaOrderStore>,
        raOrderInsertResult: InsertResult
    ) {

    }

    beforeRaMessageInsert(
        raMessage: RaMessage,
        data: any,
        context: any,
        raMessageToken: Repository<RaMessage>
    ) {

    }

    afterRaMessageInsert(
        raMessage: RaMessage,
        data: any,
        context: any,
        raMessageToken: Repository<RaMessage>,
        raMessageInsertResult: InsertResult
    ) {

    }
}
