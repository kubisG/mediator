import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { QueueModule } from "@ra/web-queue/dist/queue.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { queueFactory } from "./connection.provider";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";

@Module({
    imports: [
        EnvironmentsModule,
        CoreModule,
        AuthModule,
        QueueModule,
    ],
    controllers: [
    ],
    providers: [
        queueFactory,
    ],
    exports: [
        queueFactory,
    ],
})
export class ConnectionModule { }
