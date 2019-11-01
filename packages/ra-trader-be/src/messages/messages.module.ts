import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { ConnectionModule } from "../connection/connection.module";
import { messagesRouting, messageFilterFactory } from "./messages.provider";
import { MessagesFactoryService } from "./messages-factory.service";
import { OrderStatusMiddleware } from "./message-middlewares/order-status.middleware";
import { WebAuthModule } from "../auth/web-auth.module";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";
import { QueueService } from "./queue.service";

@Module({
    imports: [
        CoreModule,
        ConnectionModule,
        AuthModule,
        WebAuthModule,
        EnvironmentsModule,
    ],
    controllers: [
    ],
    providers: [
        ...messagesRouting,
        messageFilterFactory,
        MessagesFactoryService,
        OrderStatusMiddleware,
        QueueService,
    ],
    exports: [
        ...messagesRouting,
        messageFilterFactory,
        MessagesFactoryService,
        OrderStatusMiddleware,
        QueueService,
    ],
})
export class MessagesModule {

}
