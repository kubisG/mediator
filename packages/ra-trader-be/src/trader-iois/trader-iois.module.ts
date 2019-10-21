import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { TraderIoisService } from "./trader-iois.service";
import { TraderIoisController } from "./trader-iois.controller";
import { TraderIoisGateway } from "./trader-iois.gateway";
import { MessagesModule } from "../messages/messages.module";
import { traderIOIsProviders } from "./trader-iois.provider";
import { ConnectionModule } from "../connection/connection.module";
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
        TraderIoisController,
    ],
    providers: [
        TraderIoisService,
        TraderIoisGateway,
        ...traderIOIsProviders,
    ]
})
export class TraderIoisModule {

}
