import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { MonitorModule } from "./monitor/monitor.module";
import { UsersModule } from "@ra/web-shared-be/dist/users/users.module";
import { LayoutModule } from "@ra/web-shared-be/dist/layout/layout.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { UserSessionData } from "@ra/web-shared-be/dist/users/user-session-data";
import { UserAuthVerify } from "@ra/web-shared-be/dist/users/user-auth-verify";
import { AppDirectoryModule } from "@ra/web-shared-be/dist/app-directory/app-directory.module";
import { PreferencesModule } from "@ra/web-shared-be/dist/preferences/preferences.module";
import { TerminusModule } from "@nestjs/terminus";
import { LifeCheckService } from "@ra/web-core-be/dist/life-check/life-check.service";
import { LifeCheckModule } from "@ra/web-core-be/dist/life-check/life-check.module";

@Module({
    imports: [
        AuthModule.forRoot(
            UserSessionData,
            UserAuthVerify,
        ),
        UsersModule,
        PreferencesModule,
        MonitorModule,
        PreferencesModule,
        LayoutModule,
        AppDirectoryModule,
        TerminusModule.forRootAsync({
            imports: [LifeCheckModule],
            useClass: LifeCheckService,
        }),
    ],
    controllers: [AppController],
    providers: [
    ],
    exports: [
    ],
})
export class AppModule { }
