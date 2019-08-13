import { Inject, Injectable } from "@nestjs/common";

import { Logger } from "./providers/logger";

@Injectable()
export class LoggerService {

    constructor(
        @Inject("logger") public logger: Logger,
    ) {}

}
