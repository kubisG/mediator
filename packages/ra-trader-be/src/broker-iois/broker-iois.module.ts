import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { BrokerIoisService } from "./broker-iois.service";
import { BrokerIoisController } from "./broker-iois.controller";
import { BrokerIoisGateway } from "./broker-iois.gateway";
import { ConnectionModule } from "../connection/connection.module";
import { MessagesModule } from "../messages/messages.module";
import { brokerIOIsProviders } from "./broker-iois.provider";
import { WebAuthModule } from "../auth/web-auth.module";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";
@Module({
    imports: [
        CoreModule,
        ConnectionModule,
        AuthModule,
        MessagesModule,
        WebAuthModule,
        EnvironmentsModule
    ],
    controllers: [
        BrokerIoisController,
    ],
    providers: [
        BrokerIoisService,
        BrokerIoisGateway,
        ...brokerIOIsProviders,
    ]
})
export class BrokerIoisModule {

}
