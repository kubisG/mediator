import { Response } from "../../src/monitor/dto/response/response.interface";
import { Request } from "../../src/monitor/dto/request/request.interface";
import { BaseMessageRouter } from "@ra/web-ee-router/dist/base-message-router";
import { Queue } from "@ra/web-queue/dist/providers/queue.interface";
import { Inject } from "@nestjs/common";
import { MonitorClientRouterService } from "../../src/monitor/monitor-client-router.service";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";

export class BaseMessageRouterMock extends BaseMessageRouter<Response, Request>{

    constructor(
        @Inject("queue") queue: Queue,
        monitorClientRouterService: MonitorClientRouterService,
        @Inject("logger") logger: Logger,
    ) {
        super(queue, monitorClientRouterService, logger, [], []);
    }

    protected routeMessage(msg: Response) {

    }

}
