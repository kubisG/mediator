import { KueModule, KueTaskRegisterService } from "nestjs-kue";
import { Module, OnModuleInit, Inject } from "@nestjs/common";

import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { WorkersController } from "./workers.controller";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";
import { MessageProcessingService } from "./services/message-processing.service";
import { SleuthService } from "./services/sleuth.service";
import { DownloadService } from "./services/download.service";
import { DFDUpdateService } from "./services/dfd-update.service";
import { DaoModule } from "@ra/web-core-be/dist/dao/dao.module";
import { entities } from "../entity/entities";
import { EntityProviders } from "../entity/entity.providers";
import { entityProviders } from "../dao/repository.provider";
// import { ReSendJobService } from "./services/resend-job.service";

@Module({
    imports: [
        EnvironmentsModule,
        KueModule,
        CoreModule,
        DaoModule.forOMS(entities, [
            ...EntityProviders,
            ...entityProviders,
        ]),
    ],
    controllers: [
        WorkersController,
    ],
    providers: [
        MessageProcessingService,
        SleuthService,
        DownloadService,
        DFDUpdateService,
        // ReSendJobService,
    ],
})
export class WorkersModule implements OnModuleInit {

    constructor() { }

    public onModuleInit() { }
}
