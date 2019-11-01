import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { PreferencesService } from "./preferences.service";
import { PreferencesController } from "./preferences.controller";
import { MessagesModule } from "../messages/messages.module";
import { WebAuthModule } from "../auth/web-auth.module";

@Module({
    imports: [
        CoreModule,
        AuthModule,
        MessagesModule,
        WebAuthModule,
    ],
    controllers: [
        PreferencesController,
    ],
    providers: [
        PreferencesService,
    ],
})
export class PreferencesModule { }
