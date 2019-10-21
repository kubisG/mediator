import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { DbException } from "@ra/web-core-be/dist/exceptions/db.exception";
import { Observable } from "rxjs/internal/Observable";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { IOITransType } from "@ra/web-core-be/dist/enums/ioi-trans-type.enum";
import { MessageValidatorService } from "@ra/web-core-be/dist/validators/message-validator.service";
import { Subject } from "rxjs";
import { getCompanyId } from "@ra/web-core-be/dist/utils";
import { ExceptionDto } from "../orders/dto/exception.dto";
import { IOIType } from "@ra/web-core-be/dist/enums/ioi-type.enum";
import { ConsumeDto } from "../messages/dto/consume.dto";
import { Connection } from "typeorm/connection/Connection";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { MessagesRouter } from "../messages/routing/messages-router";
import { Repository } from "typeorm/repository/Repository";
import { IoisRepository } from "../dao/repositories/iois.repository";
import { RaIoi } from "../entity/ra-ioi";
import { UserData } from "../users/user-data.interface";

export abstract class IoisService {

    protected exceptionSubject: Subject<any> = new Subject<any>();
    protected exceptionSubject$: Observable<any> = this.exceptionSubject.asObservable();

    constructor(
        protected authService: AuthService,
        protected env: EnvironmentService,
        protected messagesService: MessagesRouter,
        protected raIois: IoisRepository,
        protected logger: Logger,
        protected messageValidatorService: MessageValidatorService,
        protected dbConnection: () => Connection,
        protected fastRandom: any,
    ) {

    }


    protected abstract async saveMessageTransaction(
        message,
        raIOIToken: Repository<RaIoi>,
        consumer
    );

    public async getIois(token: string, dates: string, compOrders: boolean = false) {
        const datesArr = dates.split("~");
        const dateFrom = datesArr[0];
        let dateTo;
        if (datesArr.length < 2) {
            dateTo = datesArr[0];
        } else {
            dateTo = datesArr[1];
        }
        const userData = await this.authService.getUserData<UserData>(token);
        return await this.raIois.getIois(dateFrom, dateTo, userData.compId, userData.userId, compOrders);
    }

    async findRaidIois(id: any): Promise<RaIoi[]> {
        return await this.raIois.find({ RaID: id });
    }

    async findOne(id: any): Promise<RaIoi> {
        return await this.raIois.findOne({ id: id });
    }

    async update(id: number, ioi: any, token: string): Promise<any> {
        const userData = await this.authService.getUserData<UserData>(token);
        ioi.user = userData.userId;
        ioi.company = userData.compId;
        try {
            const oldMessage = await this.findOne(id);
            const updateMessage = { ...oldMessage, ...ioi };
            return await this.raIois.save(updateMessage);
        } catch (ex) {
            throw new DbException(ex, "RaIois");
        }
    }

    async delete(id: number, token: string): Promise<any> {
        const userData = await this.authService.getUserData<UserData>(token);
        try {
            return await this.raIois.delete({ id: id, company: userData.compId, user: <any>userData.userId });
        } catch (ex) {
            throw new DbException(ex, "RaIois");
        }
    }

    async insert(iois: any, token: string): Promise<any> {
        const userData = await this.authService.getUserData<UserData>(token);
        iois.company = userData.compId;
        iois.user = userData.userId;
        try {
            return await this.raIois.save(iois);
        } catch (ex) {
            throw new DbException(ex, "RaIois");
        }
    }

    public exception(): Observable<ExceptionDto> {
        return new Observable((observer) => {
            this.exceptionSubject$.subscribe((message) => {
                observer.next(new ExceptionDto(message));
            });
        });
    }

    public processMessage(msg: any) {
        if (!msg.RaID) {
            msg.RaID = msg.IOIRefID ? msg.IOIRefID : msg.IOIid;
        }
        if (!msg["Type"]) {
            msg["Type"] = IOIType.Incoming;
            // we need to setup correct target
            if (msg["OnBehalfOfCompID"]) {
                msg["TargetCompID"] = msg["OnBehalfOfCompID"];
            }
            if (msg.IOITransType === IOITransType.Cancel) {
                msg.Canceled = "Y";
            } else {
                msg.RaID = msg.IOIRefID ? msg.IOIRefID : msg.IOIid;
            }
            delete msg.user;
            delete msg.userId;
            msg.TransactTime = ((!msg.TransactTime) || msg.TransactTime === null) ? new Date().toISOString() : msg.TransactTime;
        } else {
            msg.user = (!msg.user) ? msg.userId : msg.user;
        }
    }

    public consumeMessages(token: string): Observable<ConsumeDto> {
        return new Observable((observer) => {
            this.authService.getUserData(token).then((userData) => {
                this.messagesService.initConsumeMessages(userData);
                this.messagesService.getIOIs(userData).subscribe((msg) => {
                    this.processMessage(msg);
                    observer.next(new ConsumeDto(msg));
                });
            });
        });
    }

    public async saveConsumedMessages() {
        const subjects = this.messagesService.getIOIsSubjects();
        for (const consumer in subjects) {
            if (consumer) {
                subjects[consumer].subscribe(async (msg) => {
                    // moved to transaction for propper data update
                    await this.dbConnection().transaction(async (transactionalEntityManager) => {
                        const raIOIToken = transactionalEntityManager.getRepository(RaIoi);

                        this.processMessage(msg);
                        this.logger.info(`SAVING IOI MESSAGE: ${msg.msgType} RAID ${msg.RaID} TIMESTAMP: ${new Date().getTime()}`);

                        msg.company = getCompanyId(consumer, this.messagesService.getPrefix());
                        msg.companyId = msg.company;

                        try {
                            await this.saveMessageTransaction(msg, raIOIToken, consumer);
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
