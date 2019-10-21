import { Connection, Repository } from "typeorm";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { DbException } from "@ra/web-core-be/dist/exceptions/db.exception";
import { AllocTransType } from "@ra/web-core-be/dist/enums/alloc-trans-type.enum";
import { AllocStatus } from "@ra/web-core-be/dist/enums/alloc-status.enum";
import { Observable } from "rxjs/internal/Observable";
import { MessageValidatorService } from "@ra/web-core-be/dist/validators/message-validator.service";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { ConsumeDto } from "../messages/dto/consume.dto";
import { MessagesRouter } from "../messages/routing/messages-router";
import { getCompanyId } from "@ra/web-core-be/dist/utils";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { AllocationsRepository } from "../dao/repositories/allocations.repository";
import { AllocationMessageRepository } from "../dao/repositories/allocation-message.repository";
import { OrderStoreRepository } from "../dao/repositories/order-store.repository";
import { RaAllocationMessage } from "../entity/ra-allocation-message";
import { RaOrderStore } from "../entity/ra-order-store";
import { RaAllocation } from "../entity/ra-allocation";
import { UserData } from "../users/user-data.interface";

export abstract class AllocationsService {

    constructor(
        protected env: EnvironmentService,
        protected raAllocations: AllocationsRepository,
        protected raAllocationMessage: AllocationMessageRepository,
        protected raOrderStore: OrderStoreRepository,
        protected messageValidatorService: MessageValidatorService,
        protected messagesService: MessagesRouter,
        protected authService: AuthService,
        protected logger: Logger,
        protected dbConnection: () => Connection,
        protected fastRandom: any,
    ) {

    }

    public abstract async getAllocations(token: string, dates: string, filter: string, allmsg: string);

    public abstract async sendAllocations(data: any, token: string);

    protected abstract async saveMessageTransaction(
        message,
        raAllocationToken: Repository<RaAllocationMessage>,
        raOrderStoreToken: Repository<RaOrderStore>,
        raAllocToken: Repository<RaAllocation>,
        consumer
    );

    public async deleteRaidAlloc(id: any, token: string): Promise<any> {
        const userData = await this.authService.getUserData<UserData>(token);
        return await this.raAllocations.delete({ RaID: id, company: userData.compId, user: <any>userData.userId });
    }


    public async findRaidAlloc(id: any, token: string, transType: string = null): Promise<RaAllocation[]> {
        const userData = await this.authService.getUserData<UserData>(token);
        if (transType !== null) {
            return await this.raAllocations.find({ RaID: id, company: userData.compId, AllocTransType: transType, AllocStatus: transType });
        } else {
            return await this.raAllocations.find({ RaID: id, company: userData.compId });
        }
    }

    public async findOne(id: any): Promise<RaAllocation> {
        return await this.raAllocations.findOne({ id: id });
    }

    public async update(id: number, allocation: any, token: string): Promise<any> {
        const userData = await this.authService.getUserData<UserData>(token);
        allocation.user = userData.userId;
        allocation.company = userData.compId;
        try {
            const oldMessage = await this.findOne(id);
            const updateMessage = { ...oldMessage, ...allocation };
            return await this.raAllocations.save(updateMessage);
        } catch (ex) {
            throw new DbException(ex, "RaAllocations");
        }
    }

    public async delete(id: number, token: string): Promise<any> {
        const userData = await this.authService.getUserData<UserData>(token);
        try {
            return await this.raAllocations.delete({ id: id, company: userData.compId, user: <any>userData.userId });
        } catch (ex) {
            throw new DbException(ex, "RaAllocations");
        }
    }

    public async insert(allocation: any, token: string): Promise<any> {
        const userData = await this.authService.getUserData<UserData>(token);
        allocation.user = userData.userId;
        allocation.IndividualAllocID = this.fastRandom.nextInt();
        allocation.company = userData.compId;
        allocation.TransactTime = new Date().toISOString();
        allocation.AllocTransType = AllocTransType.New;
        allocation.AllocStatus = AllocStatus.New;
        try {
            return await this.raAllocations.save(allocation);
        } catch (ex) {
            throw new DbException(ex, "RaAllocations");
        }
    }

    protected async getOrder(raID: string, compId: number) {
        const queryBuilder = this.raOrderStore.createQueryBuilder("ord");
        const selectBuilder = queryBuilder
            .where("ord.RaID = :raID", { raID })
            .andWhere("ord.company = :compId", { compId: compId });

        const result = await selectBuilder.getOne();

        if (result.JsonMessage) {
            const jsonMessage = JSON.parse(result.JsonMessage);
            for (const messid in jsonMessage) {
                if ((messid) && (!result[messid])) {
                    result[messid] = jsonMessage[messid];
                }
            }
            result.JsonMessage = null;
        }
        return result;
    }

    public processMessage(msg: any) {
        if (!msg.RaID) {
            msg.RaID = msg.RefAllocID ? msg.RefAllocID : msg.AllocID;
        }
        msg.TransactTime = (!msg.TransactTime) ? new Date().toISOString() : msg.TransactTime;
    }

    public consumeMessages(token: string): Observable<ConsumeDto> {
        return new Observable((observer) => {
            this.authService.getUserData(token).then((userData) => {
                this.messagesService.initConsumeMessages(userData);
                this.messagesService.getAllocations(userData).subscribe((msg) => {
                    this.processMessage(msg);
                    observer.next(new ConsumeDto(msg));
                });
            });
        });
    }

    public onModuleInit() {
    }


    public async saveConsumedMessages() {
        const subjects = this.messagesService.getAllocationsSubjects();
        for (const consumer in subjects) {
            if (consumer) {
                subjects[consumer].subscribe(async (msg) => {
                    // moved to transaction for propper data update
                    await this.dbConnection().transaction(async (transactionalEntityManager) => {
                        const raAllocationToken = transactionalEntityManager.getRepository(RaAllocationMessage);
                        const raAllocToken = transactionalEntityManager.getRepository(RaAllocation);
                        const raOrderStoreToken = transactionalEntityManager.getRepository(RaOrderStore);

                        this.processMessage(msg);
                        this.logger.info(`SAVING ALLOC MESSAGE: ${msg.msgType} RAID ${msg.RaID} TIMESTAMP: ${new Date().getTime()}`);

                        msg.company = getCompanyId(consumer, this.messagesService.getPrefix());
                        msg.companyId = msg.company;
                        msg.user = (!msg.user) ? msg.userId : msg.user;

                        try {
                            await this.saveMessageTransaction(msg, raAllocationToken, raOrderStoreToken, raAllocToken, consumer);
                            if (msg.fields) {
                                this.messagesService.ack(msg);
                            } else {
                                this.logger.warn(`TRY ACK FAILED ID: ${msg.id}`);
                            }
                        } catch (ex) {
                            if (msg.fields) {
                                this.messagesService.nack(msg);
                            } else {
                                this.logger.warn(`TRY NACK FAILED ID: ${msg.id}`);
                            }
                            this.logger.error(ex);
                        }
                    });
                });
            }
        }
    }
}
