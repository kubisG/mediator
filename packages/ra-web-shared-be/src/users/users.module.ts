import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { AuthModule } from "@ra/web-auth-be/auth.module";
import { UserSessionData } from "./user-session-data";
import { UserAuthVerify } from "./user-auth-verify";
import { CoreModule } from "@ra/web-core-be/src/core.module";
import { JwtModule } from "@nestjs/jwt";
import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [
        CoreModule,
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.register({
            secret: EnvironmentService.instance.auth.secretKey,
            signOptions: {
                expiresIn: EnvironmentService.instance.auth.expiresIn,
            },
        }),
        AuthModule.forRoot(
            UserSessionData,
            UserAuthVerify,
        ),
    ],
    controllers: [
        UsersController,
    ],
    providers: [
        UsersService,
    ],
})
export class UsersModule {

}
