import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { SystemChannelService } from "./system-channel.service";
import { SystemChannelGateway } from "./system-channel.gateway";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";

@Module({
    imports: [
        CoreModule,
        AuthModule,
        EnvironmentsModule,
        PassportModule.register({ defaultStrategy: "jwt" }),
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
        SystemChannelGateway,
        SystemChannelService,
    ],
    exports: [
        SystemChannelService,
    ],
})
export class SystemChannelModule {

}
