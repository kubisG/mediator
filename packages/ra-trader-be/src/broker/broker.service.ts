import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { OrdersService } from "../orders/orders.service";
import { Observable } from "rxjs/internal/Observable";
import { ConsumeDto } from "../messages/dto/consume.dto";
import { InfoDto } from "../orders/dto/info.dto";
import { ExceptionDto } from "../orders/dto/exception.dto";
import { OrdersDto } from "../messages/dto/orders.dto";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { LightMapper } from "light-mapper";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { MessagesRouter } from "../messages/routing/messages-router";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { ClientProxy, Closeable } from "@nestjs/microservices";
import { Connection } from "typeorm";
import { MessagesFactoryService } from "../messages/messages-factory.service";
import { Apps } from "@ra/web-core-be/dist/enums/apps.enum";
import { OrdStatus } from "@ra/web-core-be/dist/enums/ord-status.enum";
import { Side } from "@ra/web-core-be/dist/enums/side.enum";
import { Subject } from "rxjs/internal/Subject";
import { PhoneService } from "../orders/phone.service";
import { ExecType } from "@ra/web-core-be/dist/enums/exec-type.enum";
import { BrokerSplitService } from "../orders/broker-split.service";
import * as _ from "lodash";
import { OrderUtilsService } from "../orders/order-utils.service";
import { OrderStoreRepository } from "../dao/repositories/order-store.repository";
import { MessageRepository } from "../dao/repositories/message.repository";
import { UserRepository } from "../dao/repositories/user.repository";
import { OrderRelRepository } from "../dao/repositories/order-rel.repository";
import { RaMessage } from "../entity/ra-message";
import { UserData } from "../users/user-data.interface";

@Injectable()
export class BrokerService extends OrdersService implements OnModuleInit {

    private hasSleuthSubject: Subject<any> = new Subject<any>();
    public hasSleuthSubject$: Observable<any> = this.hasSleuthSubject.asObservable();

    protected resendingInitialized: boolean = false;

    constructor(
        @Inject("brokerRouting") brokerRouting: MessagesRouter,
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
        brokerSplitService: BrokerSplitService,
        @Inject("orderRelRepository") orderRelRepository: OrderRelRepository,
        orderUtilsService: OrderUtilsService,
        phoneService: PhoneService,
    ) {
        super(
            brokerRouting,
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

        this.consumeParentMsg();
        this.consumePhoneMsg();
        this.app = Apps.broker;
    }

    private async setCanceled(msg: any) {
        const mapper = new LightMapper();
        const canceledMessage = mapper.map<RaMessage>(RaMessage, msg);
        canceledMessage.Canceled = "Y";
        delete canceledMessage.id;
        await this.raMessage.update({
            RaID: msg.RaID,
            ClOrdID: msg.ClOrdID,
            OrdStatus: msg.OrdStatus,
            CumQty: msg.CumQty,
            LeavesQty: msg.LeavesQty,
            LastPx: msg.LastPx,
            LastQty: msg.LastQty,
        }, canceledMessage);
        (canceledMessage as any).saved = true;
        (canceledMessage as any).uniqueId = msg.uniqueId;
        return canceledMessage;
    }

    private async switchMessage(msg, userData) {
        switch (msg.ExecType) {
            case ExecType.TradeCancel: {
                const canceledMessage = await this.setCanceled(msg.original);
                await this.pushToConsumer(userData, canceledMessage);
                delete msg.original;
                return msg;
            }
            default: {
                return msg;
            }
        }
    }

    public checkSleuth(data: any, company) {
        if ((data.msgType === MessageType.Order) && (data.OrdStatus === OrdStatus.PendingNew)) {
            const dateFrom = new Date();
            dateFrom.setMonth(dateFrom.getMonth() - 6);

            this.clientProxy.send<any>(
                { cmd: "hasSleuth", },
                { companyId: company, dateFrom, side: (data.Side === Side.Buy ? Side.Sell : Side.Buy), symbol: data.Symbol }
            ).subscribe((result) => {
                this.hasSleuthSubject.next({ event: "sleuth", data: { msg: data, result } });
            });
        }
    }

    public hasSleuth() {
        return this.hasSleuthSubject$;
    }

    public consumeMessages(token: string, client: any): Observable<ConsumeDto> {
        return new Observable((observer) => {
            super.consumeMessages(token, client).subscribe((data) => {
                observer.next(data);
            }, (err) => {
                observer.error(err);
            });
        });
    }

    public async sendMsg(data: any, token: any) {
        const userData = await this.authService.getUserData<UserData>(token);
        return this.sendMsgUserData(data, userData);
    }

    public async sendMsgUserData(data: any, userData: any) {
        const msg = await this.switchMessage(data, userData);
        return await super.sendOrderMessage(msg, userData);
    }

    public async cancelAllOrder(data: any, token: string) {
        return super.cancelAllOrder(data, token);
    }

    public async consumeInfo(token: string, client: any): Promise<Observable<InfoDto>> {
        return super.consumeInfo(token, client);
    }

    public exception(token: string, client: any):  Promise<Observable<ExceptionDto>> {
        return super.exception(token, client);
    }

    public async getNewMessages(token) {
        return super.getMessages(token, Apps.broker);
    }

    public async getOrders(app: number, dates: string, token: string, compOrders: string, gtcGtd: string) {
        return super.getOrders(app, dates, token, compOrders, gtcGtd);
    }


    public async getParsedOrderBroker(token: string, raID: any) {
        return super.getParsedOrder(token, Apps.broker, raID);
    }

    public async getParsedMessagesBroker(token: string, raID: any) {
        return super.getParsedMessages(token, Apps.broker, raID);
    }

    public async getMessageResponse(token: string, order: OrdersDto) {
        return super.getMessageResponse(token, order);
    }

    public async getMessagesBroker(token: string, raID?: any, symbol?: any, currency?: any) {
        return super.getMessages(token, Apps.broker, raID, symbol, currency);
    }

    public async getChildsQty(token: string, clOrdLinkID?: string) {
        return super.getChildsQty(token, clOrdLinkID);
    }

    public async getChildsPrice(token: string, clOrdLinkID?: string, side?: string) {
        const userData = await this.authService.getUserData<UserData>(token);
        return this.orderRelRepository.getChildsPrice(userData.compId, clOrdLinkID, side);
    }

    public onModuleInit() {

    }

    public consumeParentMsg() {
        this.brokerSplitService.getParentSubject().subscribe(async (data) => {
            const message = await this.brokerSplitService.processParentMessage(data);
            const userData = this.authService.createDummyToken(data.company, message.userId, Apps.broker);
            await this.sendMsgUserData(message, userData);
        });
    }

    public consumePhoneMsg() {
        this.phoneService.getTraderPhoneSubject().subscribe(async (data) => {
            await this.messagesRouter.sendToQueue(data.message, data.message.DeliverToCompID);
        });
    }

}
