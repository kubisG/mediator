import { Module, OnModuleInit } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { ConnectionModule } from "../connection/connection.module";
import { MessagesModule } from "../messages/messages.module";
import { BrokerService } from "./broker.service";
import { BrokerGateway } from "./broker.gateway";
import { BrokerController } from "./broker.controller";
import { OrdersModule } from "../orders/orders.module";
import { BrokerAccept } from "./broker-accept";
import { BrokerReject } from "./broker-reject";
import {
    brokerProviders,
    inMessageMiddlewares,
    outMessageMiddlewares,
} from "./broker.provider";
import { WebAuthModule } from "../auth/web-auth.module";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";
import { DiagnosticsModule } from "../diagnostics/diagnostics.module";
@Module({
    imports: [
        CoreModule,
        ConnectionModule,
        AuthModule,
        MessagesModule,
        OrdersModule,
        WebAuthModule,
        EnvironmentsModule,
        DiagnosticsModule,
    ],
    controllers: [
        BrokerController,
    ],
    providers: [
        BrokerService,
        BrokerAccept,
        BrokerReject,
        BrokerGateway,
        ...brokerProviders,
        ...inMessageMiddlewares,
        ...outMessageMiddlewares,
    ],
})
export class BrokerModule implements OnModuleInit {

    constructor(
        private brokerService: BrokerService,
    ) { }

    onModuleInit() {
        this.brokerService.initResending();
    }
}
