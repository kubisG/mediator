import { Injectable, Inject } from "@nestjs/common";
import { ClientRouterService } from "@ra/web-ee-router/dist/client-router.service";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";

@Injectable()
export class HubClientRouterService extends ClientRouterService {

    constructor(
        @Inject("logger") public logger: Logger,
    ) {
        super(logger);
    }
}
