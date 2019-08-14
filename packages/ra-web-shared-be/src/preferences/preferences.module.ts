import { Module } from "@nestjs/common";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { PreferencesController } from "./preferences.controller";
import { PreferencesService } from "./preferences.service";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";
import { CoreModule } from "@ra/web-core-be/dist/core.module";

@Module({
    imports: [
        CoreModule,
        AuthModule,
        EnvironmentsModule,
    ],
    controllers: [
        PreferencesController,
    ],
    providers: [
        PreferencesService,
    ],
})
export class PreferencesModule { }
