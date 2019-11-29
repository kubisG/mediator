import { Module } from "@nestjs/common";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { LayoutController } from "./layout.controller";
import { LayoutService } from "./layout.service";
import { JwtModule } from "@nestjs/jwt";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { PassportModule } from "@nestjs/passport";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";

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
        EnvironmentsModule,
    ],
    controllers: [
        LayoutController,
    ],
    providers: [
        LayoutService,
    ],
})
export class LayoutModule { }
