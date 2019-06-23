import { Module, DynamicModule } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { AuthService } from "./auth.service";
import { CoreModule } from "@ra/web-core-be/core.module";
import { JwtStrategy } from "./jwt.strategy";
import { WsAuthGuard } from "./guards/ws-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { EnvironmentsModule } from "@ra/web-env-be/environments.module";
import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { SessionDataService } from "./session-data/session-data.service";
import { VerifyService } from "./verify/verify.service";
import { DaoModule } from "@ra/web-core-be/dao/dao.module";
import { SessionDataProviderService } from "./session-data-provider.service";
import { VerifyProviderService } from "./verify-provider.service";

@Module({
    imports: [
        DaoModule,
        CoreModule,
        EnvironmentsModule,
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.register({
            secretOrPrivateKey: EnvironmentService.instance.auth.secretKey,
            signOptions: {
                expiresIn: EnvironmentService.instance.auth.expiresIn,
            },
        }),
    ],
    controllers: [
    ],
    providers: [
        AuthService,
        JwtStrategy,
        WsAuthGuard,
        RolesGuard,
        SessionDataService,
        VerifyService,
        SessionDataProviderService,
        VerifyProviderService,
        {
            provide: "test",
            useValue: "AuthModule"
        }
    ],
    exports: [
        AuthService,
        JwtStrategy,
        WsAuthGuard,
        RolesGuard,
        SessionDataService,
        VerifyService,
        SessionDataProviderService,
        VerifyProviderService,
    ]
})
export class AuthModule {
    static forRoot(
        sessionData: any,
        verifyService: any
    ): DynamicModule {
        return {
            module: AuthModule,
            providers: [
                {
                    provide: SessionDataService,
                    useClass: sessionData,
                },
                {
                    provide: VerifyService,
                    useClass: verifyService
                }
            ]
        };
    }
}
