import * as redis from "redis";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { Connection, MoreThan, In, Repository, IsNull, Not } from "typeorm";
import { Observable } from "rxjs/internal/Observable";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { LightMapper } from "light-mapper";
import { ClientProxy, Closeable } from "@nestjs/microservices";
import { OrdStatus } from "@ra/web-core-be/dist/enums/ord-status.enum";
import { Side } from "@ra/web-core-be/dist/enums/side.enum";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { Subject } from "rxjs/internal/Subject";
import { ExecType } from "@ra/web-core-be/dist/enums/exec-type.enum";
import { OrdersDto } from "../messages/dto/orders.dto";
import { ConsumeDto } from "../messages/dto/consume.dto";
import { ExceptionDto } from "./dto/exception.dto";
import { InfoDto } from "./dto/info.dto";
import { MessagesRouter } from "../messages/routing/messages-router";
import { MessagesFactoryService } from "../messages/messages-factory.service";
import { Message } from "../messages/model/message";
import { RequestType } from "@ra/web-core-be/dist/enums/request-type.enum";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { BrokerSplitService } from "./broker-split.service";
import { PhoneService } from "./phone.service";
import { QueueConnectionError } from "@ra/web-queue/dist/errors/queue-connection-error";
import { Apps } from "@ra/web-core-be/dist/enums/apps.enum";
import { OrderUtilsService } from "./order-utils.service";
import { OrderStoreRepository } from "../dao/repositories/order-store.repository";
import { MessageRepository } from "../dao/repositories/message.repository";
import { UserRepository } from "../dao/repositories/user.repository";
import { OrderRelRepository } from "../dao/repositories/order-rel.repository";
import { RaMessage } from "../entity/ra-message";
import { UserData } from "../users/user-data.interface";
import { ExecTransType } from "@ra/web-core-be/dist/enums/exec-trans-type.enum";

export abstract class OrdersService {

    protected messagesToResend: { [key: string]: any } = {};

    protected restConsumeSubjects: { [key: string]: ReplaySubject<any> } = {};
    protected restConsumeSubjects$: { [key: string]: Observable<any> } = {};

    protected consumeInfoSubject: Subject<any> = new Subject<any>();
    protected consumeInfoSubject$: Observable<any> = this.consumeInfoSubject.asObservable();

    protected exceptionSubject: Subject<any> = new Subject<any>();
    protected exceptionSubject$: Observable<any> = this.exceptionSubject.asObservable();

    protected redisClient;

    protected app;

    private subscriptions: any[] = [];

    constructor(
        protected messagesRouter: MessagesRouter,
        protected env: EnvironmentService,
        protected logger: Logger,
        protected orderStoreRepository: OrderStoreRepository,
        protected raMessage: MessageRepository,
        protected authService: AuthService,
        protected clientProxy: ClientProxy & Closeable,
        protected userRepository: UserRepository,
        protected fastRandom: any,
        protected dbConnection: () => Connection,
        protected messagesFactoryService: MessagesFactoryService,
        protected brokerSplitService: BrokerSplitService,
        protected orderRelRepository: OrderRelRepository,
        protected orderUtilsService: OrderUtilsService,
        protected phoneService: PhoneService,
    ) {
        this.redisClient = redis.createClient(this.env.redis.port, this.env.redis.host);
        this.redisClient.on("error", (error) => {
            this.logger.error(error);
        });
    }

    public async exception(token: string, client: any): Promise<Observable<ExceptionDto>> {
        const userData = await this.authService.getUserData(token) as UserData;
        return new Observable((observer) => {
            const subscription = this.exceptionSubject$.subscribe((data) => {
                if (data && data.userId && data.userId === userData.userId) {
                    observer.next(new ExceptionDto(data.message ? data.message : data));
                }
            });
            if (this.subscriptions[client.client.id]) {
                this.subscriptions[client.client.id].add(subscription);
            } else {
                this.subscriptions[client.client.id] = subscription;
            }
        });
    }

    public async consumeInfo(token: string, client: any): Promise<Observable<InfoDto>> {
        const userData = await this.authService.getUserData<UserData>(token);
        return new Observable((observer) => {
            this.userRepository.findOne({ id: userData.userId }).then((user) => {
                observer.next(new InfoDto({
                    userId: userData.userId,
                    currentBalance: user.currentBalance,
                    openBalance: user.openBalance,
                    type: "balance",
                }));
            });
            const subscription = this.consumeInfoSubject$.subscribe((data) => {
                if (data && data.userId && data.userId === userData.userId) {
                    observer.next(new InfoDto(data));
                }
            });
            if (this.subscriptions[client.client.id]) {
                this.subscriptions[client.client.id].add(subscription);
            } else {
                this.subscriptions[client.client.id] = subscription;
            }
        });
    }

    public async consumeMessagesRest(token: string) {
        const userData = await this.authService.getUserData<UserData>(token);
        if (!this.restConsumeSubjects[userData.compQueue]) {
            this.restConsumeSubjects[userData.compQueue] = new ReplaySubject<any>(1);
            this.restConsumeSubjects$[userData.compQueue] = this.restConsumeSubjects[userData.compQueue].asObservable();
            this.logger.info(`ORDERS SERVICE: CONNECTED TO CONSUME QUEUE: ${userData.compQueue}`);
            // this.messagesRouter.getQueue().consumeQueue(userData.compQueue).subscribe((msg) => {
            //      this.restConsumeSubjects[userData.compQueue].next(msg);
            // });
        }
        return this.restConsumeSubjects$[userData.compQueue];
    }

    public async getMessageResponse(token: string, order: OrdersDto) {
        const observable = await this.consumeMessagesRest(token);
        let sub;
        const result = await new Promise((resolve, reject) => {
            sub = observable.subscribe((data) => {
                if (JSON.stringify(order) !== JSON.stringify(data)) {
                    resolve(data);
                }
            });
        });
        if (sub) {
            sub.unsubscribe();
        }
        return result;
    }

    public consumeMessages(token: string, client: any): Observable<ConsumeDto> {
        return new Observable((observer) => {
            this.authService.getUserData(token).then((userData) => {
                this.messagesRouter.initConsumeMessages(userData);
                const subscription = this.messagesRouter.getOrders(userData).subscribe((msg) => {
                    observer.next(new ConsumeDto(msg));
                });
                if (this.subscriptions[client.client.id]) {
                    this.subscriptions[client.client.id].add(subscription);
                } else {
                    this.subscriptions[client.client.id] = subscription;
                }
            });
        });
    }

    protected async markAsSended(data: any) {
        this.logger.warn(`MARK MESSAGE ID: ${data.id}`);
        await this.raMessage.update({ id: data.id }, { sended: 3 });
        const notSendedCount = (await this.raMessage.find({ RaID: data.RaId, sended: 1 })).length;
        const notSendedCount2 = (await this.raMessage.find({ RaID: data.RaId, sended: 2 })).length;
        if ((notSendedCount + notSendedCount2) === 0) {
            await this.orderStoreRepository.update({ RaID: data.RaID }, { sended: 3 });
        }
    }
    protected async pushToConsumer(userData: any, msg: any) {
        this.messagesRouter.pushToConsumer(userData, msg);
    }

    protected async sendMessage(message: any, company?) {
        if (company) {
            await this.messagesRouter.sendToQueue({ ...message, notSave: false, saved: true }, company);
        }
        await this.messagesRouter.sendToQueue(message);
    }

    private async lockMessage(data: any, status: number) {
        await this.raMessage.update({ id: data.id }, { sended: status });
    }

    public async reSendOrderMessage(data: any): Promise<boolean> {
        try {
            await this.lockMessage(data, 2);
            this.logger.warn(`${data.app === Apps.trader ? "TRADER" : "BROKER"}: TRY TO RESEND MSG ${data.id}`);
            delete data.sended;
            const originalMsg = JSON.parse(data.JsonMessage);
            originalMsg.sended = 3;
            const message: Message = this.messagesFactoryService.create<Message>(Message, originalMsg);
            await this.messagesRouter.sendToQueue(await message.getJSONAsync(true));
            await this.messagesRouter.sendToQueue(originalMsg, data.SenderCompID);
            this.logger.warn(`${data.app === Apps.trader ? "TRADER" : "BROKER"}: RESENDED MSG ${data.id}`);
            return true;
        } catch (ex) {
            this.logger.error(`RESEND FAIL:`, ex);
            return false;
        }
    }

    public async sendOrderMessage(data: any, userData: any) {
        try {
            console.log("sending data,", data);
            console.log("sending userData,", userData);
            await this.messagesRouter.sendUserMessage(data, userData, data.SenderCompID);
            this.logger.info(
                `NEW ORDER WITH RaID: ${data.ClOrdID}  AND RAID ${data.RaID} TIMESTAMP: ${new Date().getTime()}`,
            );
        } catch (ex) {
            this.logger.error(ex);
            this.exceptionSubject.next(ex.message);
            if (ex instanceof QueueConnectionError) {
                // await this.saveNotSendedMessage(message, order, userData.compId, orderId, userData);
            }
        }
    }

    public async getOrders(app: number, dates: string, token: string, compOrders: string, gtcGtd: string, clOrdLinkID?: string
        ,                  isPhone?: string) {
        const datesArr = dates.split("~");
        const dateFrom = datesArr[0];
        let dateTo;
        if (datesArr.length < 2) {
            dateTo = datesArr[0];
        } else {
            dateTo = datesArr[1];
        }
        const userData = await this.authService.getUserData<UserData>(token);
        return await this.orderStoreRepository.getOrders(app, dateFrom, dateTo, userData.compId, userData.userId,
            compOrders, gtcGtd, clOrdLinkID, isPhone);
    }

    public async getNewMessages(token, app: number) {
        const userData = await this.authService.getUserData<UserData>(token);
        const result = await this.raMessage.getFillMessage(app, userData.compId );

        return result.map((val) => {
            const msg = JSON.parse(val.JsonMessage);
            msg["uniqueId"] = this.fastRandom.nextInt();
            msg["Canceled"] = val.Canceled;
            return msg;
        });
    }

    public async getMessages(token: string, app: number, raID?: any, symbol?: any, currency?: any) {
        // TODO user limitations
        const userData = await this.authService.getUserData<UserData>(token);
        let where = {};
        let select = null;
        if ((raID) && (raID !== null)) {
            where = { RaID: raID, company: userData.compId, app, OrdStatus: Not(IsNull()) }; /*, user: userData.userId*/
            return await this.raMessage.find({ where, order: { TransactTime: "ASC", id: "ASC" } });
        } else if ((symbol) && (symbol !== null)) {
            where = {
                Currency: currency, Symbol: symbol, user: userData.userId, Side: In([Side.Sell, Side.Buy])
                , OrdStatus: In([OrdStatus.PartiallyFilled, OrdStatus.Filled])
                , company: userData.compId, app,
            };
            select = ["Symbol", "TransactTime", "Side", "LastQty", "LastPx", "ExecTransType", "Canceled"];
            return await this.raMessage.find({ select, where, order: { TransactTime: "ASC", id: "ASC" } });
        }

    }

    public async getParsedOrder(token: string, app: number, raID: any) {
        const userData = await this.authService.getUserData<UserData>(token);
        const result = await this.orderStoreRepository.findOne({ app, RaID: raID, company: userData.compId });
        return result;
    }

    public async getParsedMessages(token: string, app: number, raID: any) {
        const result = await this.getMessages(token, app, raID);
        return result.map((val) => {
            const parsed = JSON.parse(val.JsonMessage);
            parsed["Canceled"] = val.Canceled;
            return parsed;
        });
    }

    public async saveConsumedMessages() {
        const subjects = this.messagesRouter.getOrdersSubjects();
        for (const consumer in subjects) {
            if (consumer) {
                subjects[consumer].subscribe(async (msg) => {
                    const message: Message = this.messagesFactoryService.create<Message>(Message, msg);
                    if (!this.env.production) {
                        if (message.getTargetCompID() && message.getTargetCompID().indexOf(this.env.queue.prefixTrader) === -1
                            && message.getSenderCompID() && message.getSenderCompID().indexOf(this.env.queue.prefixTrader) === -1) {
                            return;
                        }
                    }
                    this.clientProxy.send<any>(
                        { cmd: "messageProcessing" },
                        { ...message.getJSON(), queuePrefix: this.env.queue.prefixTrader },
                    ).subscribe((result) => {
                        this.consumeInfoSubject.next(result);
                    });
                });
            }
        }
    }

    /**
     * Find all orders and cancel them
     * @param data from FE what we want to cancel
     * @param token autorization token
     */
    public async cancelAllOrder(data: any, token: string): Promise<number> {
        const that = this;
        const userData = await this.authService.getUserData<UserData>(token);

        const side = [];
        side[side.length] = data.sell ? Side.Sell : "-1";
        side[side.length] = data.buy ? Side.Buy : "-1";
        side[side.length] = data.sellShort ? Side.ShortSell : "-1";

        const result = await this.orderStoreRepository.getOrdersForCancel(this.app,
            side, userData.compId, userData.userId, data.filtr, data.ClientID,
        );

        if (this.app === Apps.broker) {
            try {
            result.forEach(function(order: any) {
                order.SenderCompID = that.messagesRouter.getQueueName(userData);
                order.TargetCompID = order.DeliverToCompID ? order.DeliverToCompID : order.TargetCompID;
                order.company = userData.compId;
                order.compQueue = userData.compQueue;
                order.RequestType = RequestType.Broker;
                order.ExecTransType = ExecTransType.New;
                order.LeavesQty = 0;
                order.ExecType = ExecType.Canceled;
                order.ExecID = `EX${that.fastRandom.nextInt()}`;
                order.OrdStatus = OrdStatus.Canceled;
                order.TransactTime = new Date().toISOString();
                order.msgType = MessageType.Execution;
                delete order.JsonMessage;
                that.sendOrderMessage(order, userData);
            });
            } catch (ex) {
                console.log("ex", ex);
            }
        } else {
            result.forEach(function(order: any) {
                order.SenderCompID = that.messagesRouter.getQueueName(userData);
                order.TargetCompID = order.DeliverToCompID ? order.DeliverToCompID : order.TargetCompID;
                order.company = userData.compId;
                order.compQueue = userData.compQueue;
                order.RequestType = RequestType.Trader;
                order.OrigClOrdID = order.ClOrdID;
                order.ClOrdID = `${that.fastRandom.nextInt()}`;
                order.msgType = MessageType.Cancel;
                order.TransactTime = new Date().toISOString();
                // order.Placed = order.Placed ? order.Placed : new Date().toISOString();
                order.OrdStatus = OrdStatus.PendingCancel;
                delete order.JsonMessage;
                that.sendOrderMessage(order, userData);
            });
        }
        return result.length;
    }

    protected async saveNotSendedMessage(message: Message, order: any, compId: number, orderId: number, userData: any) {
        const mapper = new LightMapper();
        message.reset();
        const newMessage = mapper.map(RaMessage, { ...message.getJSON() });
        const jsonMsg = message.getJSON();
        jsonMsg.sended = 1;
        newMessage.JsonMessage = jsonMsg;
        newMessage.app = this.app;
        newMessage.sended = 1;
        await this.raMessage.insert(newMessage).then((savedMessage) => {
            const label = this.app === Apps.trader ? "TRADER" : "BROKER";
            this.logger.info(
                `${label}: RESAVE MSG RaID: ${savedMessage.identifiers[0]["id"]} - ${message.getMsgType()} TIME: ${new Date().getTime()}`,
            );
        });
        await this.orderStoreRepository.update({ id: orderId }, { sended: 1 });
        (newMessage as any).saved = true;
        await this.pushToConsumer(userData, newMessage);
    }

    public initResending() {
        this.redisClient.on("message", (channel, message) => {
            const parsedMsg: any = JSON.parse(message);
            if (!this.messagesToResend[`${parsedMsg.id}`]) {
                this.messagesToResend[`${parsedMsg.id}`] = parsedMsg;
                this.reSendOrderMessage(parsedMsg).then((result) => {
                    if (result) {
                        this.markAsSended(parsedMsg).then(() => {
                            delete this.messagesToResend[`${parsedMsg.id}`];
                        });
                    } else {
                        this.lockMessage(parsedMsg, 1).then(() => {
                            delete this.messagesToResend[`${parsedMsg.id}`];
                        });
                    }
                });
            }
        });
        this.redisClient.subscribe(`resend_${this.app}`);
    }

    public cleanMessage(message) {
        if (message.user && (!message.user.id || message.user.id === null)) {
            delete message.user;
        }
    }

    public async getChildsQty(token: string, clOrdLinkID?: string) {
        const userData = await this.authService.getUserData<UserData>(token);
        return this.orderRelRepository.getChildsQty(userData.compId, clOrdLinkID);
    }

    public removeClient(client) {
        this.subscriptions[client.client.id].unsubscribe();
    }

}
