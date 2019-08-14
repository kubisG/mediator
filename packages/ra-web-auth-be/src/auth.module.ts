import { Module, DynamicModule } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { AuthService } from "./auth.service";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { JwtStrategy } from "./jwt.strategy";
import { WsAuthGuard } from "./guards/ws-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { SessionDataService } from "./session-data/session-data.service";
import { VerifyService } from "./verify/verify.service";

const passportModule = PassportModule.register({ defaultStrategy: "jwt" });

@Module({
    imports: [
        CoreModule,
        EnvironmentsModule,
        passportModule,
        JwtModule.register({
            secret: EnvironmentService.instance.auth.secretKey,
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
        {
            provide: "test",
            useValue: "AuthModule",
        },
    ],
    exports: [
        AuthService,
        JwtStrategy,
        WsAuthGuard,
        RolesGuard,
        SessionDataService,
        VerifyService,
        passportModule,
    ],
})

export class AuthModule {
    static forRoot(
        sessionData: any,
        verifyService: any,
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
                    useClass: verifyService,
                },
            ],
        };
    }
}
