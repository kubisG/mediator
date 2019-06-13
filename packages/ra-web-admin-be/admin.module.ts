import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/core.module";
import { AuthModule } from "@ra/web-auth-be/auth.module";
import { PreferencesService } from "./preferences/preferences.service";
import { PreferencesController } from "./preferences/preferences.controller";
import { entityProviders } from "./repository.provider";

@Module({
    imports: [
        CoreModule,
        AuthModule,
    ],
    controllers: [
        PreferencesController,
    ],
    providers: [
        PreferencesService,
        ...entityProviders
    ],
    exports: [
        PreferencesService,
        ...entityProviders
    ]
})
export class AdminModule {

    constructor(
    ) { }

}
