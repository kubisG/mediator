import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { QueueModule } from "@ra/web-queue/dist/queue.module";
import { queueFactory } from "./connection.provider";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";

@Module({
    imports: [
        CoreModule,
        QueueModule,
        EnvironmentsModule,
    ],
    controllers: [
    ],
    providers: [
        ...queueFactory,
    ],
    exports: [
        ...queueFactory,
        QueueModule,
    ],
})
export class ConnectionModule { }
