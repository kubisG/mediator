import { Injectable, Inject } from "@nestjs/common";
import { Queue } from "@ra/web-queue/dist/providers/queue.interface";
import { MonitorClientRouterService } from "./monitor-client-router.service";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { Response } from "./dto/response/response.interface";
import { Request } from "./dto/request/request.interface";
import { ResponseType } from "./dto/response/response-type.enum";
import { BaseMessageRouter } from "@ra/web-ee-router/dist/base-message-router";
import { DataResponseDto } from "./dto/response/data-response.dto";
import { PageResponse } from "./dto/response/page-response.dto";
import { SubscribeErrResponseDto } from "./dto/response/subscribe-err-response.dto";
import { SubscribeOkResponse } from "./dto/response/subscribe-ok-response.dto";
import { WsDataDto } from "./dto/ws-data.dto";
import { WsPageDto } from "./dto/ws-page.dto";
import { WsSubscribeErrDto } from "./dto/ws-subscribe-err.dto";
import { WsSubscribeOkDto } from "./dto/ws-subscribe-ok.dto";
import { FastRandom } from "@ra/web-core-be/dist/fast-random.interface";
import { RequestType } from "./dto/request/request-type.enum";
import { InitOkResponse } from "./dto/response/init-ok-response.dto";
import { WsInitOkDto } from "./dto/ws-init-ok.dto";
import { MessageMiddleware } from "@ra/web-core-be/dist/middlewares/message-middleware.interface";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";

@Injectable()
export class MonitorMessageRouterService extends BaseMessageRouter<Response, Request> {

    constructor(
        private env: EnvironmentService,
        @Inject("queue") queue: Queue,
        monitorClientRouterService: MonitorClientRouterService,
        @Inject("logger") logger: Logger,
        @Inject("inMiddlewares") inMiddlewares: MessageMiddleware[],
        @Inject("outMiddlewares") outMiddlewares: MessageMiddleware[],
        @Inject("fastRandom") private fastRandom: FastRandom,
    ) {
        super(queue, monitorClientRouterService, logger, inMiddlewares, outMiddlewares);
        this.init();
    }

    private init() {
        this.consumeMessages(this.env.queue.opt.nats.dataQueue());
        this.setRequestQueue(this.env.queue.opt.nats.requestQueue());
        this.unsubscribeAll();
    }

    public unsubscribeAll() {
        this.logger.info(`UNSUBSCRIBE ALL BEFORE START`);
        this.sendMessage({
            id: this.fastRandom.nextInt(),
            type: RequestType.unSubscribeAll,
        });
    }

    private pushData(clientId: string, msg: DataResponseDto) {
        this.clientRouter.pushToClient(clientId, new WsDataDto(msg));
    }

    private pushPage(clientId: string, msg: PageResponse) {
        this.clientRouter.pushToClient(clientId, new WsPageDto(msg));
    }

    private pushSubscribeErr(clientId: string, msg: SubscribeErrResponseDto) {
        this.clientRouter.pushToClient(clientId, new WsSubscribeErrDto(msg));
    }

    private pushSubscribeOk(clientId: string, msg: SubscribeOkResponse) {
        this.clientRouter.pushToClient(clientId, new WsSubscribeOkDto(msg));
    }

    private pushInitOk(clientId: string, msg: InitOkResponse) {
        this.clientRouter.pushToClient(clientId, new WsInitOkDto(msg));
    }

    private pushMessage(clientId: string, msg: Response) {
        switch (msg.type) {
            case ResponseType.data: {
                this.pushData(clientId, msg as DataResponseDto);
                break;
            }
            case ResponseType.page: {
                this.pushPage(clientId, msg as PageResponse);
                break;
            }
            case ResponseType.subscribeErr: {
                this.pushSubscribeErr(clientId, msg as SubscribeErrResponseDto);
                break;
            }
            case ResponseType.subscribeOk: {
                this.pushSubscribeOk(clientId, msg as SubscribeOkResponse);
                break;
            }
            case ResponseType.initOk: {
                this.pushInitOk(clientId, msg as InitOkResponse);
                break;
            }
            default: {
                break;
            }
        }
    }

    private routeByHosts(msg: Response) {
        for (const host of msg.hosts) {
            try {
                this.pushMessage(host.clientId, msg);
            } catch (ex) {
                this.logger.error(`${ex.message}`);
            }
        }
    }

    private routeByClient(msg: Response) {
        try {
            this.pushMessage(msg.clientId, msg);
        } catch (ex) {
            this.logger.error(`${ex.message}`);
        }
    }

    protected routeMessage(msg: Response) {
        if (msg.hosts) {
            this.routeByHosts(msg);
        } else if (msg.clientId) {
            this.routeByClient(msg);
        } else {
            this.logger.error(`unknown message format`);
        }
    }

}
