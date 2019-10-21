import { Module } from "@nestjs/common";
import { MonitorService } from "./monitor.service";
import { MonitorGateWay } from "./monitor.gateway";
import { MonitorClientRouterService } from "./monitor-client-router.service";
import { ConnectionModule } from "../connection/connection.module";
import { MonitorMessageRouterService } from "./monitor-message-router.service";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";
import {
    inMessageMiddlewares,
    outMessageMiddlewares,
    inMiddlewaresProvider,
    outMiddlewaresProvider,
} from "./monitor.providers";
import { EERouterModule } from "@ra/web-ee-router/dist/ee-router.module";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [
        AuthModule,
        CoreModule,
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
    providers: [
        ...inMessageMiddlewares,
        ...outMessageMiddlewares,
        inMiddlewaresProvider,
        outMiddlewaresProvider,
        MonitorClientRouterService,
        MonitorMessageRouterService,
        MonitorService,
        MonitorGateWay,
    ],
})
export class MonitorModule {

}
