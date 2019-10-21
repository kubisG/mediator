import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { RaUserSessionData } from "../users/ra-user-session-data";
import { DbVerify } from "../users/db-verify";
import { webAuthProvider } from "./web-auth.provider";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { PreferencesService } from "./preferences.service";

@Module({
    imports: [
        CoreModule,
        AuthModule,
    ],
    controllers: [
    ],
    providers: [
        PreferencesService,
        EnvironmentService,
        DbVerify,
        RaUserSessionData,
        ...webAuthProvider,
    ], exports: [...webAuthProvider]
})
export class WebAuthModule {

}
