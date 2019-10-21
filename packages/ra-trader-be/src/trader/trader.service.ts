import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { OrdersService } from "../orders/orders.service";
import { Observable } from "rxjs/internal/Observable";
import { ConsumeDto } from "../messages/dto/consume.dto";
import { InfoDto } from "../orders/dto/info.dto";
import { ExceptionDto } from "../orders/dto/exception.dto";
import { OrdersDto } from "../messages/dto/orders.dto";
import { MessagesRouter } from "../messages/routing/messages-router";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { Closeable, ClientProxy } from "@nestjs/microservices";
import { Connection } from "typeorm";
import { MessagesFactoryService } from "../messages/messages-factory.service";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { Apps } from "@ra/web-core-be/dist/enums/apps.enum";
import { BrokerSplitService } from "../orders/broker-split.service";
import { OrderUtilsService } from "../orders/order-utils.service";
import { PhoneService } from "../orders/phone.service";
import { OrderStoreRepository } from "../dao/repositories/order-store.repository";
import { MessageRepository } from "../dao/repositories/message.repository";
import { UserRepository } from "../dao/repositories/user.repository";
import { OrderRelRepository } from "../dao/repositories/order-rel.repository";
import { UserData } from "../users/user-data.interface";

@Injectable()
export class TraderService extends OrdersService {

    protected resendingInitialized: boolean = false;
    protected app;

    constructor(
        @Inject("traderRouting") traderRouting: MessagesRouter,
        env: EnvironmentService,
        @Inject("logger") logger: Logger,
        @Inject("orderStoreRepository") orderStoreRepository: OrderStoreRepository,
        @Inject("messageRepository") messageRepository: MessageRepository,
        authService: AuthService,
        @Inject("clientProxy") clientProxy: ClientProxy & Closeable,
        @Inject("userRepository") userRepository: UserRepository,
        @Inject("fastRandom") fastRandom: any,
        @Inject("DbConnection") dbConnection: () => Connection,
        messagesFactoryService: MessagesFactoryService,
        @Inject("orderRelRepository") orderRelRepository: OrderRelRepository,
        brokerSplitService: BrokerSplitService,
        orderUtilsService: OrderUtilsService,
        phoneService: PhoneService,
    ) {
        super(
            traderRouting,
            env,
            logger,
            orderStoreRepository,
            messageRepository,
            authService,
            clientProxy,
            userRepository,
            fastRandom,
            dbConnection,
            messagesFactoryService,
            brokerSplitService,
            orderRelRepository,
            orderUtilsService,
            phoneService
        );
        this.consumePhoneMsg();
        this.app = Apps.trader;
    }


    public consumeMessages(token: string, client: any): Observable<ConsumeDto> {
        return super.consumeMessages(token, client);
    }

    public async sendMsg(data: any, userData: any) {
        return super.sendOrderMessage(data, userData);
    }

    public async cancelAllOrder(data: any, token: string) {
        const userData = await this.authService.getUserData<UserData>(token);
        const resultCount = await super.cancelAllOrder(data, token);
        this.consumeInfoSubject.next({ type: "cancelAllResult", resultCount, userId: userData.userId });
        return resultCount;
    }

    public async consumeInfo(token: string, client: any): Promise<Observable<InfoDto>> {
        return super.consumeInfo(token, client);
    }

    public exception(token: string, client: any): Promise<Observable<ExceptionDto>> {
        return super.exception(token, client);
    }

    public async getNewMessages(token) {
        return super.getNewMessages(token);
    }

    public async getOrders(app: number, dates: string, token: string, compOrders: string, gtcGtd: string, clOrdLinkID?: string
        , isPhone?: string) {
        return super.getOrders(app, dates, token, compOrders, gtcGtd, clOrdLinkID, isPhone);
    }

    public async getChildsQty(token: string, clOrdLinkID?: string) {
        return super.getChildsQty(token, clOrdLinkID);
    }

    public async getParsedMessagesTrader(token: string, raID: any) {
        return super.getParsedMessages(token, Apps.trader, raID);
    }

    public async getParsedOrderTrader(token: string, raID: any) {
        return super.getParsedOrder(token, Apps.trader, raID);
    }

    public async getMessageResponse(token: string, order: OrdersDto) {
        return super.getMessageResponse(token, order);
    }

    public async getMessagesTrader(token: string, raID?: any, symbol?: any, currency?: any) {
        return super.getMessages(token, Apps.trader, raID, symbol, currency);
    }

    public consumePhoneMsg() {
        this.phoneService.getBrokerPhoneSubject().subscribe(async (data) => {
            await this.messagesRouter.sendToQueue(data.message, data.message.OnBehalfOfCompID);
        });
    }

    public async getClients(token) {
        const userData = await this.authService.getUserData<UserData>(token);
        return await this.orderStoreRepository.getClients(userData.compId, Apps.trader);
    }
}
