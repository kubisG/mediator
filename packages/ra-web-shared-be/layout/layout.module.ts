import { Module } from "@nestjs/common";
import { AuthModule } from "@ra/web-auth-be/auth.module";
import { LayoutController } from "./layout.controller";
import { LayoutService } from "./layout.service";
import { JwtModule } from "@nestjs/jwt";
import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [
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
        LayoutController,
    ],
    providers: [
        LayoutService,
    ],
})
export class LayoutModule { }
