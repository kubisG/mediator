import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { MessagesModule } from "../messages/messages.module";
import { ConnectionModule } from "../connection/connection.module";
import { WebAuthModule } from "../auth/web-auth.module";

@Module({
    imports: [
        CoreModule,
        AuthModule,
        WebAuthModule,
        ConnectionModule,
        MessagesModule,
    ],
    controllers: [
    ],
    providers: [
    ],
})
export class AllocationsModule {

}
