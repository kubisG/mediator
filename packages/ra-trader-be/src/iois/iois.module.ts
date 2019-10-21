import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { ConnectionModule } from "../connection/connection.module";
import { MessagesModule } from "../messages/messages.module";
import { WebAuthModule } from "../auth/web-auth.module";

@Module({
    imports: [
        CoreModule,
        ConnectionModule,
        AuthModule,
        MessagesModule,
        WebAuthModule
    ],
    controllers: [
    ],
    providers: [
    ]
})
export class IoisModule {

}
