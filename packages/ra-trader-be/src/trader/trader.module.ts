import { Module, OnModuleInit } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { MessagesModule } from "../messages/messages.module";
import { TraderService } from "./trader.service";
import { TraderController } from "./trader.controller";
import { TraderGateway } from "./trader.gateway";
import { OrdersModule } from "../orders/orders.module";
import { traderProviders, inMessageMiddlewares, outMessageMiddlewares } from "./trader.provider";
import { ConnectionModule } from "../connection/connection.module";
import { WebAuthModule } from "../auth/web-auth.module";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";

@Module({
    imports: [
        CoreModule,
        ConnectionModule,
        MessagesModule,
        OrdersModule,
        AuthModule,
        WebAuthModule,
        EnvironmentsModule,
    ],
    controllers: [
        TraderController,
    ],
    providers: [
        TraderService,
        TraderGateway,
        ...traderProviders,
        ...inMessageMiddlewares,
        ...outMessageMiddlewares,
    ],
})
export class TraderModule implements OnModuleInit {

    constructor(
        private traderService: TraderService,
    ) { }

    onModuleInit() {
        this.traderService.initResending();
    }
}
