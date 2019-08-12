import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/core.module";
import { AuthModule } from "@ra/web-auth-be/auth.module";
import { PreferencesService } from "./preferences/preferences.service";
import { PreferencesController } from "./preferences/preferences.controller";
import { entityProviders } from "./repository.provider";
import { JwtModule } from "@nestjs/jwt";
import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { PassportModule } from "@nestjs/passport";
@Module({
    imports: [
        CoreModule,
        AuthModule,
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.register({
            secret: EnvironmentService.instance.auth.secretKey,
            signOptions: {
                expiresIn: EnvironmentService.instance.auth.expiresIn,
            },
        }),
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
