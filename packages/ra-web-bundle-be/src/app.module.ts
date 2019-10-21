import { Module } from "@nestjs/common";
import { MonitorModule } from "ra-web-monitor-be/dist/monitor/monitor.module";
import { UsersModule } from "@ra/web-shared-be/dist/users/users.module";
import { LayoutModule } from "@ra/web-shared-be/dist/layout/layout.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { UserSessionData } from "@ra/web-shared-be/dist/users/user-session-data";
import { UserAuthVerify } from "@ra/web-shared-be/dist/users/user-auth-verify";
import { AppDirectoryModule } from "@ra/web-shared-be/dist/app-directory/app-directory.module";
import { PreferencesModule } from "@ra/web-shared-be/dist/preferences/preferences.module";
import { ObjectRightsModule } from "@ra/web-shared-be/dist/object-rights/object-rights.module";
import { FormsModule } from "ra-web-forms-be/dist/forms-data/forms.module";
import { LocatesModule } from "ra-web-forms-be/dist/locates-data/locates-data.module";
import { HubChannelModule } from "ra-web-forms-be/dist/hub-channel/hub-channel.module";
import { SystemChannelModule } from "ra-web-forms-be/dist/system-channel/system-channel.module";
import { DaoModule } from "@ra/web-core-be/dist/dao/dao.module";
import { entities } from "ra-web-forms-be/dist/forms-dao/entity/entities";
import { FormsDaoModule } from "ra-web-forms-be/dist/forms-dao/forms-dao.module";
import { FormsSpecModule } from "ra-web-forms-be/dist/forms-spec/forms-spec.module";
import { CompaniesModule } from "@ra/web-shared-be/dist/companies/companies.module";
import { TerminusModule } from "@nestjs/terminus";
import { LifeCheckService } from "@ra/web-core-be/dist/life-check/life-check.service";
import { LifeCheckModule } from "@ra/web-core-be/dist/life-check/life-check.module";

@Module({
    imports: [
        DaoModule.forRoot([...entities]),
        AuthModule.forRoot(
            UserSessionData,
            UserAuthVerify,
        ),
        ObjectRightsModule,
        UsersModule,
        PreferencesModule,
        MonitorModule,
        PreferencesModule,
        LayoutModule,
        AppDirectoryModule,
        FormsModule,
        LocatesModule,
        HubChannelModule,
        SystemChannelModule,
        FormsDaoModule,
        FormsSpecModule,
        CompaniesModule,
        TerminusModule.forRootAsync({
            imports: [LifeCheckModule],
            useClass: LifeCheckService,
        }),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule { }
