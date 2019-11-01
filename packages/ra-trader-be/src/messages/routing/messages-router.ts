import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { Subscription } from "rxjs/internal/Subscription";
import { Queue } from "@ra/web-queue/dist/providers/queue.interface";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { UserMsgValidationError } from "./user-msg-validation-error";
import { MiddlewareRunner } from "@ra/web-core-be/dist/middlewares/middleware-runner";
import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { SpecType } from "@ra/web-core-be/dist/enums/spec-type.enum";
import { Resolver } from "dns";

export class MessagesRouter {

    private id = 0;
    private consumeOrder: { [key: string]: Subject<any> } = {};
    private consumeOrder$: { [key: string]: Observable<any> } = {};

    private consumeAllocation: { [key: string]: Subject<any> } = {};
    private consumeAllocation$: { [key: string]: Observable<any> } = {};

    private consumeIOI: { [key: string]: Subject<any> } = {};
    private consumeIOI$: { [key: string]: Observable<any> } = {};

    private initializedConsumers: string[] = [];
    private subscripions: { [key: string]: Subscription } = {};

    private middlewareRunnerIn = new MiddlewareRunner(this.logger);
    private middlewareRunnerOut = new MiddlewareRunner(this.logger);

    constructor(
        private queue: Queue,
        private logger: Logger,
        private fastRandom: any,
        public queuePrefix: string,
        public queueNameOut: string,
        private app: number,
    ) { }

    private switchMessages(msg: any, queue: string) {
        switch (msg.msgType) {
            case MessageType.IOI: {
                this.consumeIOI[queue].next(msg);
                break;
            }
            case MessageType.Allocation: {
                this.consumeAllocation[queue].next(msg);
                break;
            }
            case MessageType.AllocationInstructionAck: {
                this.consumeAllocation[queue].next(msg);
                break;
            }
            default: {
                msg.uniqueId = this.fastRandom.nextInt();
                msg.TransactTime = new Date().toISOString();
                // msg.Placed = msg.Placed ? msg.Placed : new Date().toISOString();
                this.consumeOrder[queue].next(msg);
                break;
            }
        }
    }

    private checkMessage(msg: any, userData: any): boolean {
        if (msg.company && msg.company !== userData.compId) {
            this.logger.error(`msg.company: ${msg.company} / ${userData.compId}`);
            return false;
        }
        if (msg.user && msg.user !== userData.userId) {
            this.logger.error(`msg.user: ${msg.user}`);
            return false;
        }
        if (msg.userId && msg.userId !== userData.userId) {
            this.logger.error(`msg.userId: ${msg.userId}`);
            return false;
        }
        if (msg.SenderCompID && (msg.SenderCompID !== userData.compQueueTrader && msg.SenderCompID !== userData.compQueueBroker)) {
            this.logger.error(`msg.SenderCompID: ${msg.SenderCompID} ${userData.compQueueTrader} ${userData.compQueueBroker}`);
            return false;
        }
        if (msg.compQueue && (msg.compQueue !== userData.compQueueTrader && msg.compQueue !== userData.compQueueBroker)) {
            this.logger.error(`msg.compQueue: ${msg.compQueue} ${userData.compQueueTrader} ${userData.compQueueBroker}`);
            return false;
        }
        return true;
    }

    public setInMiddlewares(mids: MessageMiddleware[]) {
        this.middlewareRunnerIn.setMiddlewares(mids);
    }

    public setOutMiddlewares(mids: MessageMiddleware[]) {
        this.middlewareRunnerOut.setMiddlewares(mids);
    }

    public getPrefix() {
        return this.queuePrefix;
    }

    public sendToQueue(msg: any, queue?: string): Promise<boolean> {
        const q = queue ? queue : this.queueNameOut;
        return this.queue.sendToQueue(msg, q);
    }

    public sendInternalMessage(msg, queue): Promise<boolean> {
        const q = queue ? queue : this.queueNameOut;
        return this.queue.sendInternalMsg(msg, q);
    }

    public getQueueName(userData) {
        return `${this.queuePrefix}${userData.compId}`;
    }

    public sendUserMessage(msg: any, userData: any, resendQueue: string, queue?: string): Promise<boolean> {
        const q = queue ? queue : this.queueNameOut;
        if (!this.checkMessage(msg, userData)) {
            throw new UserMsgValidationError("Failed to check message against user session");
        }
        return new Promise((resolve, reject) => {
            this.id++;
            this.logger.info(`${this.id} RUNNING OUT`);

            this.middlewareRunnerOut.run(msg, {
                messageRouter: this,
                userData,
                app: this.app,
                queue,
                nextQueue: q,
                resendQueue,
                finish: false,
                id: this.id,
                side: "OUT",
            }).then((result) => {
                if (!result) {
                    resolve(true);
                } else {
                    if (result.specType === SpecType.phone) {
                        resolve(true);
                    } else {
                        this.sendToQueue(result, q).then((sended) => {
                            resolve(sended);
                        }).catch((err) => {
                            reject(err);
                        }).catch((err) => {
                            reject(err);
                        });
                    }
                }
            });
        });
    }

    public initConsumeMessages(userData: any, defQueue?: string) {
        let queue = defQueue;
        if ((userData) && (userData !== null)) {
            queue = this.getQueueName(userData);
        }
        return this.createConsumers(queue).then(() => {
            if (!this.subscripions[queue]) {
                this.logger.info(`MESSAGE ROUTER: CONNECTED TO CONSUME QUEUE: ${queue}`);
                this.subscripions[queue] = this.queue.consumeQueue(queue).subscribe((msg) => {
                    this.id++;
                    this.logger.info(`${this.id} RUNNING IN`);

                    this.middlewareRunnerIn.run(msg, {
                        messageRouter: this,
                        userData,
                        queue,
                        finish: false,
                        app: this.app,
                        id: this.id,
                        side: "IN",
                    }).then((data) => {
                        console.log("data", data);
                        console.log("msg", msg);
                        // message is empty.. end...
                        if (!data) {
                            return;
                        }
                        this.switchMessages(data, queue);
                    });
                });
            }
        });
    }

    public async createConsumers(queue: string) {
        if (this.initializedConsumers.indexOf(queue) === -1) {
            await this.queue.createQueue(queue);
            this.queue.createConsumers(queue);
            this.logger.info(`MESSAGE ROUTER: CREATING MESSAGE CONSUMER FOR: ${queue}`);
            this.consumeOrder[queue] = new Subject<any>();
            this.consumeOrder$[queue] = this.consumeOrder[queue].asObservable();
            this.consumeAllocation[queue] = new Subject<any>();
            this.consumeAllocation$[queue] = this.consumeAllocation[queue].asObservable();
            this.consumeIOI[queue] = new Subject<any>();
            this.consumeIOI$[queue] = this.consumeIOI[queue].asObservable();
            this.initializedConsumers.push(queue);
        }
    }

    public ack(msg: any) {
        this.queue.ack(msg.fields);
    }

    public nack(msg: any) {
        this.queue.nack(msg.fields);
    }

    public getOrdersSubjects(): { [key: string]: Observable<any> } {
        return this.consumeOrder$;
    }

    public getIOIsSubjects(): { [key: string]: Observable<any> } {
        return this.consumeIOI$;
    }

    public getAllocationsSubjects(): { [key: string]: Observable<any> } {
        return this.consumeAllocation$;
    }

    public pushToConsumer(userData: any, msg: any) {
        this.consumeOrder[this.getQueueName(userData)].next(msg);
    }

    public getOrders(userData: any): Observable<any> {
        return this.consumeOrder$[this.getQueueName(userData)];
    }

    public getIOIs(userData: any): Observable<any> {
        return this.consumeIOI$[this.getQueueName(userData)];
    }

    public getAllocations(userData: any): Observable<any> {
        return this.consumeAllocation$[this.getQueueName(userData)];
    }

}
