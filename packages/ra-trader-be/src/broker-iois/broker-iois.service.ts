import { Injectable, Inject } from "@nestjs/common";
import { Observable } from "rxjs/internal/Observable";
import { ExceptionDto } from "../orders/dto/exception.dto";
import { MessagesRouter } from "../messages/routing/messages-router";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { MessageValidatorService } from "@ra/web-core-be/dist/validators/message-validator.service";
import { Connection, Repository } from "typeorm";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { IoisService } from "../iois/iois.service";
import { IOIType } from "@ra/web-core-be/dist/enums/ioi-type.enum";
import { IOITransType } from "@ra/web-core-be/dist/enums/ioi-trans-type.enum";
import { MessageType } from "@ra/web-core-be/dist/enums/message-type.enum";
import { RequestType } from "@ra/web-core-be/dist/enums/request-type.enum";
import { LightMapper } from "light-mapper";
import { IoisRepository } from "../dao/repositories/iois.repository";
import { RaIoi } from "../entity/ra-ioi";
import { UserData } from "../users/user-data.interface";

@Injectable()
export class BrokerIoisService extends IoisService {

    constructor(
        authService: AuthService,
        env: EnvironmentService,
        @Inject("brokerRouting") brokerRouting: MessagesRouter,
        @Inject("ioisRepository") raIois: IoisRepository,
        @Inject("logger") logger: Logger,
        @Inject("messageFilter") messageFilter: MessageValidatorService,
        @Inject("DbConnection") dbConnection: () => Connection,
        @Inject("fastRandom") fastRandom: any,
    ) {
        super(
            authService,
            env,
            brokerRouting,
            raIois,
            logger,
            messageFilter,
            dbConnection,
            fastRandom,
        );
    }

    public async getIois(token: string, dates: string) {
        return super.getIois(token, dates, true);
    }

    public async findRaidIois(id: any) {
        return super.findRaidIois(id);
    }

    public async findOne(id: any) {
        return super.findOne(id);
    }

    public async update(id: any, ioi: any, token: string): Promise<any> {
        return super.update(id, ioi, token);
    }

    public async delete(id: any, token: string): Promise<any> {
        return super.delete(id, token);
    }

    public async insert(iois: any, token: string): Promise<any> {
        return super.insert(iois, token);
    }

    /**
     * TODO : split & validace
     * @param data
     * @param token
     */
    public async sendIois(data: any, token: string) {
        const userData = await this.authService.getUserData<UserData>(token);

        if (data.action === "E") {
            data.IOIid = this.fastRandom.nextInt();
            data.RaID = data.IOIid;
        } else {
            data.IOIid = data.IOIid ? data.IOIid : this.fastRandom.nextInt();
            if (!data.RaID) {
                data.RaID = data.IOIid;
            }
        }

        data["Type"] = IOIType.Outgoing;
        data["IOITransType"] = IOITransType.New;
        data["msgType"] = MessageType.IOI;
        data["RequestType"] = RequestType.Trader;
        data["TransactTime"] = new Date().toISOString();
        data["company"] = userData.compId;
        data["userId"] = userData.userId;

        if ((data.action === "R") || (data.action === "C")) {
            data["IOITransType"] = IOITransType.Replace;
            if (data.action === "C") {
                data["IOITransType"] = IOITransType.Cancel;
                data["Canceled"] = "Y";
            }
            data["IOIRefID"] = data["IOIid"];
            data["IOIid"] = this.fastRandom.nextInt();
        }

        let treatedMessage = { ...data };
        const sended = { ...data };

        try {
            treatedMessage = await this.messageValidatorService.treatMessage(treatedMessage);
            if (data.action === "E") {
                treatedMessage["TargetCompID"] = data.TargetCompID;
                sended["TargetCompID"] = data.TargetCompID;
                treatedMessage["OnBehalfOfCompID"] = this.messagesService.getQueueName(userData);
                sended["OnBehalfOfCompID"] = this.messagesService.getQueueName(userData);
            }
            treatedMessage["RequestType"] = RequestType.Broker;
            sended["RequestType"] = RequestType.Broker;
            treatedMessage["SenderCompID"] = this.messagesService.getQueueName(userData);

            this.messagesService.sendToQueue(sended, treatedMessage.SenderCompID);
            this.messagesService.sendToQueue(treatedMessage);

            this.logger.info(
                `NEW IOI WITH ID: ${treatedMessage["IOIid"]}  AND RAID ${treatedMessage.RaID} TIMESTAMP: ${new Date().getTime()}`);
        } catch (ex) {
            this.exceptionSubject.next(ex.message);
            this.logger.error(ex);
        }
    }

    protected async saveMessageTransaction(msg,
                                           raIOIToken: Repository<RaIoi>, consumer) {
        const mapper = new LightMapper();

        const newMessage = mapper.map(RaIoi, msg);
        if (msg.IOITransType === IOITransType.Replace) {
            await raIOIToken.update({ IOIid: msg.IOIRefID, company: msg.company }, newMessage).then(() => {
                this.logger.info(
                    `UPDATED IOI WITH ID: ${newMessage.id} - ${newMessage.msgType} TIMESTAMP: ${new Date().getTime()}`,
                );
            });
        } else if (msg.IOITransType === IOITransType.Cancel) {
            await raIOIToken.update({ IOIid: msg.IOIRefID, company: msg.company },
                {
                    Canceled: "Y", IOITransType: IOITransType.Cancel, IOIid: msg.IOIid, IOIRefID: msg.IOIRefID,
                }).then(() => {
                    this.logger.info(
                        `CANCELED IOI WITH ID: ${newMessage.id} - ${newMessage.msgType} TIMESTAMP: ${new Date().getTime()}`,
                    );
                });
        } else {
            newMessage.JsonMessage = msg;

            await raIOIToken.insert(newMessage).then((savedMessage) => {
                this.logger.info(`NEW IOI WITH ID: ${savedMessage.identifiers[0]["id"]}` +
                    ` - ${msg.msgType} TIMESTAMP: ${new Date().getTime()}`);
            });
        }
    }

    public exception(): Observable<ExceptionDto> {
        return super.exception();
    }

    public consumeMessages(token: string): Observable<ExceptionDto> {
        return new Observable((observer) => {
            super.consumeMessages(token).subscribe((data) => {
                observer.next(data);
            }, (err) => {
                observer.error(err);
            });
        });
    }

}
