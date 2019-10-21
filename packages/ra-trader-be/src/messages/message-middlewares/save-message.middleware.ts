import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { Connection, Repository, UpdateResult, InsertResult } from "typeorm";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { LightMapper } from "light-mapper";
import { logMessage, parseCompanyId } from "@ra/web-core-be/dist/utils";
import { ContextMiddlewareInterface } from "@ra/web-core-be/dist/middlewares/context-middleware.interface";
import { CompanyRepository } from "../../dao/repositories/company.repository";
import { RaOrderStore } from "../../entity/ra-order-store";
import { RaMessage } from "../../entity/ra-message";

export abstract class SaveMessageMiddleware implements MessageMiddleware {

    constructor(
        private dbConnection: () => Connection,
        protected logger: Logger,
        protected fastRandom: any,
        private companyRepository: CompanyRepository,
    ) { }

    private async orderExists(data: any, context: any, raOrderStoreToken: Repository<RaOrderStore>) {
        return await raOrderStoreToken.findOne({ RaID: data.RaID, app: context.app });
    }

    private async saveMessage(data: any, context: any) {
        this.logger.warn(`${context.id} SAVE ${logMessage(data)}`);
        const mapper = new LightMapper();
        return await this.dbConnection().transaction(async (transactionalEntityManager) => {
            const raMessageToken: Repository<RaMessage> = transactionalEntityManager.getRepository(RaMessage);
            const raOrderStoreToken: Repository<RaOrderStore> = transactionalEntityManager.getRepository(RaOrderStore);

            const orderExist = await this.orderExists(data, context, raOrderStoreToken);

            await this.beforeAll(data, context, raOrderStoreToken, raMessageToken);

            if (context.queue || context.resendQueue) {
                data.company = context.queue ? parseCompanyId(context.queue) : parseCompanyId(context.resendQueue);
            }

            let raOrder: RaOrderStore = mapper.map<RaOrderStore>(RaOrderStore, { ...data, app: context.app });
            const raMessage: RaMessage = mapper.map<RaMessage>(RaMessage, { ...data, app: context.app });

            await this.beforeRaMessageInsert(raMessage, data, context, raMessageToken);
            raMessage.JsonMessage = JSON.stringify(data);
            const raMessageInsertResult = await raMessageToken.insert(raMessage);
            await this.afterRaMessageInsert(raMessage, data, context, raMessageToken, raMessageInsertResult);
            this.logger.info(`${context.id} APP: ${context.app} INSERTED MESSAGE: ${logMessage(data)}`);

            if (orderExist) {
                raOrder = await this.beforeRaOrderUpdate(raOrder, data, context, raOrderStoreToken, orderExist);
                const raOrderUpdateResult = await raOrderStoreToken.update({ RaID: data.RaID, app: context.app }, raOrder);
                await this.afterRaOrderUpdate(raOrder, data, context, raOrderStoreToken, raOrderUpdateResult);
                this.logger.info(`${context.id} APP: ${context.app} UPDATED ORDER: ${logMessage(data)}`);
            } else {
                raOrder.JsonMessage = JSON.stringify(data);
                await this.beforeRaOrderInsert(raOrder, data, context, raOrderStoreToken);
                const raOrderInsertResult = await raOrderStoreToken.insert(raOrder);
                await this.afterRaOrderInsert(raOrder, data, context, raOrderStoreToken, raOrderInsertResult);
                this.logger.info(`${context.id} APP: ${context.app} INSERTED ORDER: ${logMessage(data)}`);
            }
        });
    }

    abstract async beforeAll(
        data: any,
        context: any,
        raOrderStoreToken: Repository<RaOrderStore>,
        raMessageToken: Repository<RaMessage>
    );

    abstract async beforeRaOrderUpdate(
        raOrder: RaOrderStore,
        data: any,
        context: any,
        raOrderStoreToken: Repository<RaOrderStore>,
        orderExist: RaOrderStore
    );

    abstract async afterRaOrderUpdate(
        raOrder: RaOrderStore,
        data: any,
        context: any,
        raOrderStoreToken: Repository<RaOrderStore>,
        raOrderUpdateResult: UpdateResult);

    abstract async beforeRaOrderInsert(
        raOrder: RaOrderStore,
        data: any,
        context: any,
        raOrderStoreToken: Repository<RaOrderStore>
    );

    abstract async afterRaOrderInsert(
        raOrder: RaOrderStore,
        data: any,
        context: any,
        raOrderStoreToken: Repository<RaOrderStore>,
        raOrderInsertResult: InsertResult,
    );

    abstract async beforeRaMessageInsert(
        raMessage: RaMessage,
        data: any,
        context: any,
        raMessageToken: Repository<RaMessage>
    );

    abstract async afterRaMessageInsert(
        raMessage: RaMessage,
        data: any,
        context: any,
        raMessageToken: Repository<RaMessage>,
        raMessageInsertResult: InsertResult,
    );

    async resolve(data: any, context: ContextMiddlewareInterface): Promise<any> {
        const result = await this.saveMessage(data, context);
        return data;
    }

}
