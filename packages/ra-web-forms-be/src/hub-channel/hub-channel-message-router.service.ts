import { Injectable, Inject } from "@nestjs/common";
import { Queue } from "@ra/web-queue/dist/providers/queue.interface";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { Response } from "./dto/response/response.interface";
import { Request } from "./dto/request/request.interface";
import { ResponseType } from "./dto/response/response-type.enum";
import { BaseMessageRouter } from "@ra/web-ee-router/dist/base-message-router";
import { FastRandom } from "@ra/web-core-be/dist/fast-random.interface";
import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { LocatesDataRepository } from "../forms-dao/repositories/locates-data.repository";
import { LocatesDto } from "./dto/response/locates.dto";
import { HubClientRouterService } from "./hub-client-router.service";
import { LocatesDataDto } from "./dto/locates-data.dto";
import { LocatesUpdateSubscriber } from "../forms-dao/subscribers/locates-update.subscriber";
import { Subscription } from "rxjs";
import { LocatesUpdateRepository } from "../forms-dao/repositories/locates-update.repository";
import { LocatesStatus } from "../locates-data/locates-status.enum";
import { LightMapper } from "light-mapper";
import { RaLocatesData } from "../forms-dao/entity/ra-locates-data";
import { CompanyRepository } from "@ra/web-core-be/dist/dao/repositories/company.repository";
import { AuditTrailRepository } from "@ra/web-core-be/dist/dao/repositories/audit-trail.repository";

@Injectable()
export class HubMessageRouterService extends BaseMessageRouter<Response, Request> {

    private sub: Subscription;

    constructor(
        private env: EnvironmentService,
        private hubClientRouterService: HubClientRouterService,
        private locatesUpdate: LocatesUpdateSubscriber,
        @Inject("mailer") private emailsService,
        @Inject("queue") queue: Queue,
        @Inject("logger") logger: Logger,
        @Inject("inMiddlewares") inMiddlewares: MessageMiddleware[],
        @Inject("outMiddlewares") outMiddlewares: MessageMiddleware[],
        @Inject("fastRandom") private fastRandom: FastRandom,
        @Inject("locatesUpdateRepository") private locatesUpdateDataRep: (LocatesUpdateRepository | any),
        @Inject("locatesDataRepository") private locatesDataRep: (LocatesDataRepository | any),
        @Inject("companyRepository") private companyRep: (CompanyRepository | any),
        @Inject("auditTrailRepository") private auditTrailRep: (AuditTrailRepository | any),
    ) {
        super(queue, null, logger, inMiddlewares, outMiddlewares);
        this.init();
        this.dbListener();
    }

    private init() {
        this.consumeMessages(this.env.queue.opt.nats.dataQueue());
        this.setRequestQueue(this.env.queue.opt.nats.requestQueue());
        // for testing
        // this.setRequestQueue(this.env.queue.opt.nats.dataQueue);
    }

    private async updateLocates(myLoc) {
        await this.locatesDataRep.update({
            id: myLoc.id,
        },
            {
                usedShares: myLoc.usedShares,
                availableShares: myLoc.availableShares,
                status: myLoc.status,
            });

        // need to send messages to all connected clients from company
        this.hubClientRouterService.pushToAccount(`COMP${myLoc.companyId}`, new LocatesDataDto({ type: "single", data: myLoc }));
    }

    private async processOldLocates(locates) {
        const results = await this.locatesDataRep.getLocates(locates.clientId, locates.symbol, locates.broker, false);
        if ((results) && (results.length > 0)) {
            for (const myLoc of results) {
                myLoc.usedShares = myLoc.usedShares + locates.usedQuantity;
                myLoc.availableShares = myLoc.quantity - myLoc.usedShares;
                locates.usedQuantity = 0;
                await this.updateLocates(myLoc);

                const company = await this.companyRep.findOne({
                    select: ["id", "companyMail"]
                    , where: { id: myLoc.companyId },
                });
                this.emailsService.send("admin@rapidaddition.com", company.companyMail,
                    "Locates problem", `Used more locates (${locates.symbol}, ${locates.broker}, ${locates.usedQuantity}) than allocated!`);
                this.logger.warn(
                    `${company.companyMail} - used more locates (${locates.symbol}, ${locates.broker}, ${locates.usedQuantity}) than allocated!`,
                );
                if (locates.usedQuantity === 0) {
                    break;
                }
            }
        }
    }

    private async processEdgeLocates(locates) {

        let mail;
        try {
            const company = await this.companyRep.findOne({
                select: ["id", "companyMail"]
                , where: { clientId: locates.clientId },
            });
            mail = company.companyMail;
            locates.company = company.id;
            locates.user = "APP";
            locates.quantity = 0;
            const mapper = new LightMapper();
            const newData = mapper.map<RaLocatesData>(RaLocatesData, locates);
            newData.clientId = locates.clientId;
            newData.broker = locates.broker;
            newData.symbol = locates.symbol;
            newData.status = LocatesStatus.Done;
            newData.createdBy = "APP";
            newData.usedShares = locates.usedQuantity;
            newData.availableShares = (-1 * locates.usedQuantity);
            newData.quantity = 0;

            const savedData = await this.locatesDataRep.save(newData);

            // need to send messages to all connected clients from company
            this.hubClientRouterService.pushToAccount(`COMP${company.id}`, new LocatesDataDto({ type: "single", data: savedData }));
            this.emailsService.send("admin@rapidaddition.com", mail,
                "Locates problem", `Used more locates (${newData.symbol}, ${newData.broker}, ${locates.usedQuantity}) than allocated!`);
            this.logger.warn(
                `${mail} ${newData.clientId} - used more locates (${newData.symbol}, ${newData.broker}, ${locates.usedQuantity}) than allocated!`,
            );
            this.auditTrailRep.afterInsert(savedData.id, savedData, "ra_locates_data", "APP", locates.company);
        } catch (ex) {
            this.logger.error(ex);
            this.emailsService.send("admin@rapidaddition.com", mail, "Locates problem", ex);
        }
    }

    private async processLocates(data: LocatesDto[], fromDB?: boolean) {
        if (data && data.length > 0) {
            for (const locates of data) {
                const results = await this.locatesDataRep.getLocates(locates.clientId, locates.symbol, locates.broker);

                for (let i = 0; i < results.length; i++) {
                    const myLoc = results[i];
                    if (locates.usedQuantity < myLoc.availableShares) {
                        myLoc.usedShares = myLoc.usedShares + locates.usedQuantity;
                        myLoc.availableShares = myLoc.quantity - myLoc.usedShares;
                        myLoc.status = LocatesStatus.Used;
                        locates.usedQuantity = 0;
                    } else if ((locates.usedQuantity === myLoc.availableShares) || (i === (results.length - 1))) {
                        myLoc.usedShares = myLoc.usedShares + locates.usedQuantity;
                        myLoc.availableShares = myLoc.quantity - myLoc.usedShares;
                        myLoc.status = LocatesStatus.Done;
                        locates.usedQuantity = 0;
                    } else if (locates.usedQuantity > myLoc.availableShares) {
                        locates.usedQuantity = locates.usedQuantity - myLoc.availableShares;
                        myLoc.usedShares = myLoc.quantity;
                        myLoc.availableShares = myLoc.quantity - myLoc.usedShares;
                        myLoc.status = LocatesStatus.Done;
                    }

                    await this.updateLocates(myLoc);
                    if (locates.usedQuantity === 0) {
                        break;
                    }
                }
                if (locates.usedQuantity > 0) {
                    await this.processOldLocates(locates);
                    // we still have some qty
                    if (locates.usedQuantity > 0) {
                        await this.processEdgeLocates(locates);
                    }
                }

                if (fromDB) {
                    await this.locatesUpdateDataRep.delete({ id: locates.id });
                }
            }
        } else {
            this.logger.error(`response has no data`);
        }
    }

    private async clearLocates(fromDBid?: number) {
        const results = await this.locatesDataRep.setExpiredLocates();
        if (results) {
            if (fromDBid) {
                await this.locatesUpdateDataRep.delete({ id: fromDBid });
            }
            for (const result of results) {
                this.hubClientRouterService.pushToAccount(`COMP${result.comp}`, new LocatesDataDto({ type: "all" }));
            }
        }
    }

    private processMsg(clientId: string, msg: Response, fromDB?: boolean) {
        if (clientId === this.env.queue.opt.nats.locatesId) {
            switch (msg.type) {
                case ResponseType.locates: {
                    this.processLocates(msg.data, fromDB);
                    break;
                }
                case ResponseType.clearLocates: {
                    if (fromDB) {
                        this.clearLocates((msg.data as any).id);
                    } else {
                        this.clearLocates();
                    }
                    break;
                }
                default: {
                    this.logger.error(`response is not locates type "${msg.type}"`);
                    break;
                }
            }
        } else {
            this.logger.error(`response is not from this nodejs id "${this.env.queue.opt.nats.locatesId}"`);
        }
    }

    protected routeMessage(msg: Response) {
        if (msg.clientId) {
            this.processMsg(msg.clientId, msg);
        } else {
            this.logger.error(`unknown message format`);
        }
    }

    private async dbListener() {
        // we need to process all unprocessed messages, during stopped BE...
        const unprocessed = await this.locatesUpdateDataRep.find();
        if (unprocessed && unprocessed.length > 0) {
            for (const data of unprocessed) {
                this.processMsg(this.env.queue.opt.nats.locatesId, { id: "1", type: ResponseType.locates, data: [data] }, true);
            }
        }

        // we subscribe to changes NOTIFY from postgres
        this.sub = this.locatesUpdate.updateSubject$.subscribe((data) => {
            if (data && data.type === ResponseType.locates) {
                if (data instanceof Array) {
                    this.processMsg(this.env.queue.opt.nats.locatesId, { id: "1", type: ResponseType.locates, data }, true);
                } else {
                    this.processMsg(this.env.queue.opt.nats.locatesId, { id: "1", type: ResponseType.locates, data: [data] }, true);
                }
            } else if (data && data.type === ResponseType.clearLocates) {
                this.processMsg(this.env.queue.opt.nats.locatesId, { id: "2", type: ResponseType.clearLocates, data }, true);
            }
        });
    }
}
