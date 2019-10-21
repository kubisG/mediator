import { Module } from "@nestjs/common";
import { HubChannelService } from "./hub-channel.service";
import { ConnectionModule } from "../connection/connection.module";
import { HubMessageRouterService } from "./hub-channel-message-router.service";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";
import {
    inMessageMiddlewares,
    outMessageMiddlewares,
    inMiddlewaresProvider,
    outMiddlewaresProvider,
} from "./hub-channel.providers";
import { EERouterModule } from "@ra/web-ee-router/dist/ee-router.module";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { PassportModule } from "@nestjs/passport";
import { FormsDaoModule } from "../forms-dao/forms-dao.module";
import { HubChannelController } from "./hub-channel.controller";
import { HubClientRouterService } from "./hub-client-router.service";
import { HubChannelGateWay } from "./hub-channel.gateway";

@Module({
    imports: [
        AuthModule,
        CoreModule,
        FormsDaoModule,
        EERouterModule,
        ConnectionModule,
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
        HubChannelController,
    ],
    providers: [
        ...inMessageMiddlewares,
        ...outMessageMiddlewares,
        inMiddlewaresProvider,
        outMiddlewaresProvider,
        HubChannelService,
        HubMessageRouterService,
        HubClientRouterService,
        HubChannelGateWay,
    ],
})
export class HubChannelModule {

}
