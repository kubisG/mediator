import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { DiagnosticsController } from "./diagnostics.controller";
import { DiagnosticsService } from "./diagnostics.service";
import { ReadyHealthIndicator } from "./ready.health";
import { ConnectionModule } from "../connection/connection.module";
import { DiagnosticsGateway } from "./diagnostics.gateway";
import { HubService } from "./hub.service";
import { WebAuthModule } from "../auth/web-auth.module";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";

@Module({
    imports: [
        CoreModule,
        ConnectionModule,
        AuthModule,
        EnvironmentsModule,
        WebAuthModule,
    ],
    controllers: [
        DiagnosticsController,
    ],
    providers: [
        DiagnosticsService,
        HubService,
        DiagnosticsGateway,
        ReadyHealthIndicator,
    ],
    exports: [
        DiagnosticsService,
        HubService,
        ReadyHealthIndicator,
    ],
})
export class DiagnosticsModule { }
