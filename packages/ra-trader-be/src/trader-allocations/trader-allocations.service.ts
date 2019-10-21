import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { Observable } from "rxjs/internal/Observable";
import { ConsumeDto } from "../messages/dto/consume.dto";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { AllocationsService } from "../allocations/allocations.service";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { AllocTransType } from "@ra/web-core-be/dist/enums/alloc-trans-type.enum";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { AllocStatus } from "@ra/web-core-be/dist/enums/alloc-status.enum";
import { OrderAllocated } from "@ra/web-core-be/dist/enums/order-allocated.enum";
import { MessageValidatorService } from "@ra/web-core-be/dist/validators/message-validator.service";
import { MessagesRouter } from "../messages/routing/messages-router";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { Connection, Repository } from "typeorm";
import { LightMapper } from "light-mapper";
import { RequestType } from "@ra/web-core-be/dist/enums/request-type.enum";
import { parseCompanyId } from "@ra/web-core-be/dist/utils";
import { AllocationsRepository } from "../dao/repositories/allocations.repository";
import { AllocationMessageRepository } from "../dao/repositories/allocation-message.repository";
import { OrderStoreRepository } from "../dao/repositories/order-store.repository";
import { RaAllocation } from "../entity/ra-allocation";
import { RaAllocationMessage } from "../entity/ra-allocation-message";
import { RaOrderStore } from "../entity/ra-order-store";
import { UserData } from "../users/user-data.interface";
import { Apps } from "@ra/web-core-be/dist/enums/apps.enum";

@Injectable()
export class TraderAllocationsService extends AllocationsService implements OnModuleInit {

    constructor(
        env: EnvironmentService,
        @Inject("allocationsRepository") raAllocations: AllocationsRepository,
        @Inject("allocationMessageRepository") raAllocationMessage: AllocationMessageRepository,
        @Inject("orderStoreRepository") raOrderStore: OrderStoreRepository,
        @Inject("messageFilter") messageFilter: MessageValidatorService,
        @Inject("traderRouting") traderRouting: MessagesRouter,
        authService: AuthService,
        @Inject("logger") logger: Logger,
        @Inject("DbConnection") dbConnection: () => Connection,
        @Inject("fastRandom") fastRandom: any,
    ) {
        super(
            env,
            raAllocations,
            raAllocationMessage,
            raOrderStore,
            messageFilter,
            traderRouting,
            authService,
            logger,
            dbConnection,
            fastRandom,
        );
    }

    public async getAllocations(token: string, dates: string, filter: string, allmsg: string) {
        const datesArr = dates.split("~");
        const dateFrom = datesArr[0];
        let dateTo;
        if (datesArr.length < 2) {
            dateTo = datesArr[0];
        } else {
            dateTo = datesArr[1];
        }

        const userData = await this.authService.getUserData<UserData>(token);
        return await this.raOrderStore.getAllocations(dateFrom, dateTo, userData.compId, userData.userId, filter, allmsg, Apps.trader);
    }

    async findRaidAlloc(id: any, token: string, transType: string = null): Promise<RaAllocation[]> {
        return super.findRaidAlloc(id, token, transType);
    }

    async deleteRaidAlloc(id: any, token: string): Promise<RaAllocation[]> {
        return super.deleteRaidAlloc(id, token);
    }

    async findOne(id: any): Promise<RaAllocation> {
        return super.findOne(id);
    }

    async update(id: number, allocation: any, token: string): Promise<any> {
        return super.update(id, allocation, token);
    }

    async delete(id: number, token: string): Promise<any> {
        return super.delete(id, token);
    }

    async insert(allocation: any, token: string): Promise<any> {
        return super.insert(allocation, token);
    }


    /**
     * TODO : split & validace
     * @param data
     * @param token
     */
    public async sendAllocations(data: any, token: string) {
        const userData = await this.authService.getUserData<UserData>(token);
        const allAlloc = await this.findRaidAlloc(data.raID, token, AllocTransType.New);
        const allAllocHub = allAlloc.map(a => ({ ...a }));        // clone array
        const order = await this.getOrder(data.raID, userData.compId);

        if (data.type === "C") {
            order["AllocTransType"] = AllocTransType.Cancel;
            order["RefAllocID"] = order.AllocID;
        } else {
            order["AllocTransType"] = AllocTransType.New;
        }

        order["AllocID"] = this.fastRandom.nextInt();
        order["RequestType"] = RequestType.Alloc;
        order["TradeDate"] = order["Placed"];
        delete order["AllocRejCode"];
        delete order["AllocStatus"];
        order["Shares"] = order["CumQty"];
        order["msgType"] = MessageType.Allocation;
        order["SenderCompID"] = this.messagesService.getQueueName(userData);
        order["TargetCompID"] = order["DeliverToCompID"];
        for (let i = 0; i < allAlloc.length; i++) { // repeating group

            allAlloc[i]["RequestType"] = RequestType.AllocRow;
            allAlloc[i]["msgType"] = MessageType.Allocation;
            allAlloc[i]["AllocID"] = order["AllocID"];
            allAllocHub[i] = { ...allAlloc[i] };
            allAlloc[i] = await this.messageValidatorService.treatMessage(allAlloc[i]);
            delete allAlloc[i]["RequestType"];
            delete allAlloc[i]["msgType"];
            delete allAlloc[i]["id"];

        }
        let treatedMessage = { ...order };
        treatedMessage = await this.messageValidatorService.treatMessage(treatedMessage);

        treatedMessage["RequestType"] = RequestType.Trader;
        treatedMessage["NoOrders"] = 0;

        const sendMessage = { ...treatedMessage };
        sendMessage["AllocStatus"] = AllocStatus.New;
        treatedMessage["NoAllocs"] = allAlloc;
        delete treatedMessage["AllocStatus"];
        sendMessage["NoAllocs"] = allAllocHub;
        if (data.type === "C") {
            sendMessage["Allocated"] = null;
            sendMessage["AllocID"] = null;
        } else {
            sendMessage["Allocated"] = OrderAllocated.Sended;
        }
        try {


            this.messagesService.sendToQueue(sendMessage, treatedMessage.SenderCompID);
            this.messagesService.sendToQueue(treatedMessage);

            this.logger.info(
                `NEW ALLOC WITH ID: ${treatedMessage["AllocID"]}  AND RAID ${treatedMessage.RaID} TIMESTAMP: ${new Date().getTime()}`);
        } catch (ex) {
            this.logger.error(ex);
        }
    }

    public consumeMessages(token: string): Observable<ConsumeDto> {
        return new Observable((observer) => {
            super.consumeMessages(token).subscribe((data) => {
                observer.next(data);
            }, (err) => {
                observer.error(err);
            });
        });
    }

    public onModuleInit() {
    }


    protected async processCancel(msg, raAllocationToken, raOrderStoreToken, raAllocToken, consumer) {
        await raAllocationToken.update({ AllocID: msg.RefAllocID, company: parseCompanyId(consumer) },
            {
                Canceled: "Y", AllocTransType: AllocTransType.Cancel, AllocID: msg.AllocID, RefAllocID: msg.RefAllocID
            }).then(() => {
                this.logger.info(`CANCELED ALLOC WITH ID: ${msg.id} - ${msg.msgType} TIMESTAMP: ` + `${new Date().getTime()}`
                );
            });

        if (msg.msgType === MessageType.Allocation) {
            await raOrderStoreToken.update({ RaID: msg.RaID, company: parseCompanyId(consumer) },
                { Allocated: null, AllocID: null }).then((savedOrder) => {
                    this.logger.info(`CANCELED ALLOCATION ORDER WITH ID: ${msg.RaID} TIMESTAMP: ${new Date().getTime()}`);
                });

            await raAllocToken.update({
                RaID: msg.RaID, company: parseCompanyId(consumer), AllocTransType: AllocTransType.New, AllocStatus: AllocStatus.New
            },
                {
                    AllocStatus: msg.AllocStatus, AllocID: msg.AllocID, Canceled: "Y", AllocTransType: AllocTransType.Cancel
                })
                .then((savedOrder) => {
                    this.logger.info(`UPD ALLOC WITH ID: ${msg.RaID} TIMESTAMP: ${new Date().getTime()}`);
                });
        }
    }

    protected async processAllocation(msg, raOrderStoreToken, raAllocToken, consumer) {
        await raOrderStoreToken.update({ RaID: msg.RaID, company: parseCompanyId(consumer) },
            { Allocated: OrderAllocated.Sended, AllocID: msg.AllocID }).then((savedOrder) => {
                this.logger.info(`SENDED ALLOCATION ORDER WITH ID: ${msg.RaID} TIMESTAMP: ${new Date().getTime()}`);
            });

        await raAllocToken.update({
            RaID: msg.RaID, company: parseCompanyId(consumer), AllocTransType: AllocTransType.New, AllocStatus: AllocTransType.New
        },
            { AllocStatus: msg.AllocStatus, AllocID: msg.AllocID }).then((savedOrder) => {
                this.logger.info(`UPD ALLOC WITH ID: ${msg.RaID} TIMESTAMP: ${new Date().getTime()}`);
            });
    }

    protected async processAllocationAck(msg, raAllocationToken, raOrderStoreToken, raAllocToken, consumer) {
        if (msg.AllocStatus === AllocStatus.Accepted) {
            await raOrderStoreToken.update({ RaID: msg.RaID, company: parseCompanyId(consumer) },
                { Allocated: OrderAllocated.Allocated }).then((savedOrder) => {
                    this.logger.info(`UPD ORDER WITH ID: ${msg.RaID} TIMESTAMP: ${new Date().getTime()}`);
                });
        } else {
            await raOrderStoreToken.update({ RaID: msg.RaID, company: parseCompanyId(consumer) },
                { Allocated: OrderAllocated.Rejected, AllocID: null, AllocRejCode: msg.AllocRejCode })
                .then((savedOrder) => {
                    this.logger.info(`UPD ORDER BACK WITH ID: ${msg.RaID} TIMESTAMP: ${new Date().getTime()}`);
                });
        }

        await raAllocToken.update({
            RaID: msg.RaID, company: parseCompanyId(consumer), AllocTransType: AllocTransType.New, AllocStatus: AllocStatus.New
        },
            { AllocStatus: msg.AllocStatus, AllocID: msg.AllocID }).then((savedOrder) => {
                this.logger.info(`UPD ALLOC WITH ID: ${msg.RaID} TIMESTAMP: ${new Date().getTime()}`);
            });

        await raAllocationToken.update({
            RaID: msg.RaID, company: parseCompanyId(consumer), AllocTransType: AllocTransType.New, AllocStatus: AllocStatus.New
        },
            {
                AllocStatus: msg.AllocStatus, AllocID: msg.AllocID
            }).then((savedOrder) => {
                this.logger.info(`UPD ALLOCMESSAGE WITH ID: ${msg.RaID} TIMESTAMP: ${new Date().getTime()}`);
            });
    }

    protected async saveMessageTransaction(msg,
        raAllocationToken: Repository<RaAllocationMessage>,
        raOrderStoreToken: Repository<RaOrderStore>,
        raAllocToken: Repository<RaAllocation>,
        consumer) {
        const mapper = new LightMapper();
        const newMessage = mapper.map(RaAllocationMessage, msg);

        if (msg.AllocTransType === AllocTransType.Cancel) {
            await this.processCancel(msg, raAllocationToken, raOrderStoreToken, raAllocToken, consumer);
        } else {
            newMessage.JsonMessage = msg;

            // insert new
            await raAllocationToken.insert(newMessage).then((savedMessage) => {
                this.logger.info(`NEW ALLOC WITH ID: ${savedMessage.identifiers[0]["id"]} - ${msg.msgType} TS: ${new Date().getTime()}`);
            });

            if (msg.msgType === MessageType.Allocation) {
                await this.processAllocation(msg, raOrderStoreToken, raAllocToken, consumer);
            } else if (msg.msgType === MessageType.AllocationInstructionAck) {
                await this.processAllocationAck(msg, raAllocationToken, raOrderStoreToken, raAllocToken, consumer);
            }
        }

    }

}
