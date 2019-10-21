import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { Observable } from "rxjs/internal/Observable";
import { LightMapper } from "light-mapper";
import { ConsumeDto } from "../messages/dto/consume.dto";
import { MessagesRouter } from "../messages/routing/messages-router";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { MessageValidatorService } from "@ra/web-core-be/dist/validators/message-validator.service";
import { Connection, Repository } from "typeorm";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { AllocationsService } from "../allocations/allocations.service";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { AllocTransType } from "@ra/web-core-be/dist/enums/alloc-trans-type.enum";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { AllocStatus } from "@ra/web-core-be/dist/enums/alloc-status.enum";
import { OrderAllocated } from "@ra/web-core-be/dist/enums/order-allocated.enum";
import { RequestType } from "@ra/web-core-be/dist/enums/request-type.enum";
import { parseCompanyId } from "@ra/web-core-be/dist/utils";
import { AllocationsRepository } from "../dao/repositories/allocations.repository";
import { AllocationMessageRepository } from "../dao/repositories/allocation-message.repository";
import { OrderStoreRepository } from "../dao/repositories/order-store.repository";
import { RaAllocation } from "../entity/ra-allocation";
import { RaAllocationMessage } from "../entity/ra-allocation-message";
import { RaOrderStore } from "../entity/ra-order-store";
import { UserData } from "../users/user-data.interface";

@Injectable()
export class BrokerAllocationsService extends AllocationsService implements OnModuleInit {

    constructor(
        env: EnvironmentService,
        @Inject("allocationsRepository") raAllocations: AllocationsRepository,
        @Inject("allocationMessageRepository") raAllocationMessage: AllocationMessageRepository,
        @Inject("orderStoreRepository") raOrderStore: OrderStoreRepository,
        @Inject("messageFilter") messageFilter: MessageValidatorService,
        @Inject("brokerRouting") brokerRouting: MessagesRouter,
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
            brokerRouting,
            authService,
            logger,
            dbConnection,
            fastRandom
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
        return await this.raAllocationMessage.getBrokerAllocations(dateFrom, dateTo, userData.compId);
    }


    /**
    * TODO : split & validace
    * @param data
    * @param token
    */
    public async sendAllocations(data: any, token: string) {
        const userData = await this.authService.getUserData<UserData>(token);

        if (data.state === "Reject") {
            data.AllocStatus = AllocStatus.AccountLevelReject;
        } else {
            data.AllocStatus = AllocStatus.Accepted;
        }
        delete data.state;

        if (!data.AvgPx) {
            data.AvgPx = 0;
        }
        data["RequestType"] = RequestType.AllocInst;
        data["msgType"] = MessageType.Allocation;
        data["TargetCompID"] = data["OnBehalfOfCompID"];
        data["SenderCompID"] = this.messagesService.getQueueName(userData);

        try {
            let treatedMessage = { ...data };
            treatedMessage = await this.messageValidatorService.treatMessage(treatedMessage);
            treatedMessage["msgType"] = MessageType.AllocationInstructionAck;
            data["msgType"] = MessageType.AllocationInstructionAck;
            delete data.RequestType;

            treatedMessage["RequestType"] = RequestType.Broker;
            this.messagesService.sendToQueue(data, treatedMessage.SenderCompID);
            this.messagesService.sendToQueue(treatedMessage);

            this.logger.info(`NEW ALLOC WITH ID: ${treatedMessage["AllocID"]}  AND RAID ${data.RaID} TIMESTAMP: ${new Date().getTime()}`);
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

    async findOne(id: any): Promise<RaAllocation> {
        return super.findOne(id);
    }

    public onModuleInit() {
    }

    protected async processCancel(msg, raAllocationToken, consumer) {
        await raAllocationToken.update({ AllocID: msg.RefAllocID, company: parseCompanyId(consumer) },
            {
                Canceled: "Y", AllocTransType: AllocTransType.Cancel,
                AllocID: msg.AllocID, RefAllocID: msg.RefAllocID
            }).then(() => {
                this.logger.info(
                    `CANCELED ALLOC WITH ID: ${msg.id} - ${msg.msgType} TIMESTAMP: ` +
                    `${new Date().getTime()}`
                );
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
            { AllocStatus: msg.AllocStatus, AllocID: msg.AllocID }).then((savedOrder) => {
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
            this.processCancel(msg, raAllocationToken, consumer);
        } else {
            newMessage.JsonMessage = msg;

            if (!newMessage.AllocStatus) {
                newMessage.AllocStatus = AllocStatus.New;
            }

            await raAllocationToken.insert(newMessage).then((savedMessage) => {
                this.logger.info(`NEW ALLOC WITH ID: ${savedMessage.identifiers[0]["id"]} - ${msg.msgType} TIMESTAMP: ` +
                    `${new Date().getTime()}`
                );
            });

            // ack for allocation
            if (msg.msgType === MessageType.AllocationInstructionAck) {
                await this.processAllocationAck(msg, raAllocationToken, raOrderStoreToken, raAllocToken, consumer);
            }
        }

    }

}
