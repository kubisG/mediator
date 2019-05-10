import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { AuthService } from "./auth.service";
import { CoreModule } from "@ra/web-core-be/core.module";
import { JwtStrategy } from "./jwt.strategy";
import { WsAuthGuard } from "./guards/ws-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { EnvironmentsModule } from "@ra/web-env-be/environments.module";
import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { verifyServiceFactory, sessionDataFactory } from "./verify.provider";
import { DaoModule } from "@ra/web-dao/dao.module";
import { VerifyProviderService } from "./verify-provider.service";
import { SessionDataProviderService } from "./session-data-provider.service";

@Module({
    imports: [
        CoreModule,
        EnvironmentsModule,
        DaoModule,
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
        sessionDataFactory,
        verifyServiceFactory,
        VerifyProviderService,
        SessionDataProviderService,
    ],
    exports: [
        AuthService,
        JwtStrategy,
        WsAuthGuard,
        RolesGuard,
        VerifyProviderService,
        SessionDataProviderService,
    ]
})
export class AuthModule { }
