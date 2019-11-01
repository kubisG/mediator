import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { TraderAllocationsService } from "./trader-allocations.service";
import { TraderAllocationsController } from "./trader-allocations.controller";
import { TraderAllocationsGateway } from "./trader-allocations.gateway";
import { MessagesModule } from "../messages/messages.module";
import { traderAllocationsProviders } from "./trader-allocations.provider";
import { ConnectionModule } from "../connection/connection.module";
import { WebAuthModule } from "../auth/web-auth.module";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";

@Module({
    imports: [
        CoreModule,
        ConnectionModule,
        MessagesModule,
        AuthModule,
        WebAuthModule,
        EnvironmentsModule,
    ],
    controllers: [
        TraderAllocationsController,
    ],
    providers: [
        TraderAllocationsService,
        TraderAllocationsGateway,
        ...traderAllocationsProviders,
    ],
})
export class TraderAllocationsModule {

}
