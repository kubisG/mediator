import * as redis from "redis";
import { Controller, Inject } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { Observable } from "rxjs/internal/Observable";
import { MessageProcessingService } from "./services/message-processing.service";
import { SleuthService } from "./services/sleuth.service";
import { DownloadService } from "./services/download.service";
import { DFDUpdateService } from "./services/dfd-update.service";

@Controller()
export class WorkersController {

    private redisClient;

    constructor(
        private readonly messageProcessingService: MessageProcessingService,
        private sleuthService: SleuthService,
        private downloadService: DownloadService,
        private dfdUpdateService: DFDUpdateService,
        private env: EnvironmentService,
        @Inject("logger") private logger: Logger,
    ) {
        this.redisClient = redis.createClient(this.env.redis.port, this.env.redis.host);
        this.redisClient.on("error", (error) => {
            this.logger.error(error);
        });
    }

    @MessagePattern({ cmd: "messageProcessing" })
    public async messageProcessing(data: any) {
        if (data.queuePrefix !== this.env.queue.prefixTrader) {
            return null;
        }
        return new Observable((observer) => {
            this.messageProcessingService.processMessage(data).then((result) => {
                observer.next(result);
            }).catch((err) => {
                observer.next(err);
            });
        });
    }

    @MessagePattern({ cmd: "hasSleuth" })
    public async hasSleuth(data: any) {
        return await this.sleuthService.hasSleuth(data);
    }

    @MessagePattern({ cmd: "jobDownload" })
    public async downloadData(data: any) {
        return await this.downloadService.downloadData(data);
    }

    @MessagePattern({ cmd: "jobDfdUpdate" })
    public async dfdUpdate(data: any) {
        return await this.dfdUpdateService.dfdUpdate(data);
    }
}
