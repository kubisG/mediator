import { SaveMessageMiddleware } from "../../messages/message-middlewares/save-message.middleware";
import { Injectable, Inject } from "@nestjs/common";
import { Repository, UpdateResult, InsertResult, Connection } from "typeorm";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { Apps } from "@ra/web-core-be/dist/enums/apps.enum";
import { OrdStatus } from "@ra/web-core-be/dist/enums/ord-status.enum";
import { BrokerSplitService } from "../../orders/broker-split.service";
import { parseCompanyId } from "@ra/web-core-be/dist/utils";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { CompanyRepository } from "../../dao/repositories/company.repository";
import { OrderRelRepository } from "../../dao/repositories/order-rel.repository";
import { RaOrderStore } from "../../entity/ra-order-store";
import { RaMessage } from "../../entity/ra-message";
import { RaCompany } from "../../entity/ra-company";
import { ExecType } from "@ra/web-core-be/dist/enums/exec-type.enum";

@Injectable()
export class SaveMessageTraderMiddleware extends SaveMessageMiddleware {

    constructor(
        @Inject("DbConnection") dbConnection: () => Connection,
        @Inject("logger") logger: Logger,
        @Inject("fastRandom") fastRandom: any,
        @Inject("companyRepository") companyRepository: CompanyRepository,
        @Inject("orderRelRepository") private orderRelRepository: OrderRelRepository,
        private brokerSplitService: BrokerSplitService,
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
        orderExist: RaOrderStore
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

    private async updateRelQty(newOrderMessage, context, qty) {
        await this.orderRelRepository.update({
            parentClOrdId: newOrderMessage.ClOrdLinkID,
            childClOrdId: newOrderMessage.RaID,
            company: <any>parseCompanyId(context.queue),
        }, { OrderQty: qty });
    }

    async afterRaOrderUpdate(
        raOrder: RaOrderStore,
        data: any, context: any,
        raOrderStoreToken: Repository<RaOrderStore>,
        raOrderUpdateResult: UpdateResult
    ) {
        if (data.ClOrdLinkID) {
            if ((data.OrdStatus === OrdStatus.PartiallyFilled)
                || (data.OrdStatus === OrdStatus.Filled)
            ) {
                this.brokerSplitService.updateParentMsg({ data: data, company: parseCompanyId(context.queue) });
            } else if (data.OrdStatus === OrdStatus.Canceled) {
                await this.updateRelQty(data, context, data.CumQty);
            } else if (data.OrdStatus === OrdStatus.Replaced) {
                await this.updateRelQty(data, context, data.OrderQty);
            }
        }
    }

    beforeRaOrderInsert(
        raOrder: RaOrderStore,
        data: any,
        context: any,
        raOrderStoreToken: Repository<RaOrderStore>
    ) {

    }

    async afterRaOrderInsert(
        raOrder: RaOrderStore,
        data: any,
        context: any,
        raOrderStoreToken: Repository<RaOrderStore>,
        raOrderInsertResult: InsertResult
    ) {
        if (data.ClOrdLinkID) {
            const find = await raOrderStoreToken.findOne({
                RaID: data.ClOrdLinkID,
                companyId: context.userData.compId,
                app: Apps.broker
            });
            await this.orderRelRepository.insert(
                {
                    parentId: find.id, parentClOrdId: data.ClOrdLinkID, company: new RaCompany(context.userData.compId),
                    childId: raOrderInsertResult.identifiers[0].id, childClOrdId: data.RaID,
                    OrderQty: data.OrderQty
                }
            );
            await raOrderStoreToken.update(
                {
                    id: find.id
                }, { splitted: "Y" }
            );
        }
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
