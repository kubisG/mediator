import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { BrokerAllocationsService } from "./broker-allocations.service";
import { BrokerAllocationsController } from "./broker-allocations.controller";
import { BrokerAllocationsGateway } from "./broker-allocations.gateway";
import { MessagesModule } from "../messages/messages.module";
import { brokerAllocationsProviders } from "./broker-allocations.provider";
import { ConnectionModule } from "../connection/connection.module";
import { WebAuthModule } from "../auth/web-auth.module";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";

@Module({
    imports: [
        CoreModule,
        AuthModule,
        ConnectionModule,
        MessagesModule,
        WebAuthModule,
        EnvironmentsModule,
    ],
    controllers: [
        BrokerAllocationsController,
    ],
    providers: [
        BrokerAllocationsService,
        BrokerAllocationsGateway,
        ...brokerAllocationsProviders,
    ],
})
export class BrokerAllocationsModule {

}
