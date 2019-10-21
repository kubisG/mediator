import { Module } from "@nestjs/common";
import { UsersModule } from "@ra/web-shared-be/dist/users/users.module";
import { ObjectRightsModule } from "@ra/web-shared-be/dist/object-rights/object-rights.module";
import { LayoutModule } from "@ra/web-shared-be/dist/layout/layout.module";
import { PreferencesModule } from "@ra/web-shared-be/dist/preferences/preferences.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { UserSessionData } from "@ra/web-shared-be/dist/users/user-session-data";
import { UserAuthVerify } from "@ra/web-shared-be/dist/users/user-auth-verify";
import { AppDirectoryModule } from "@ra/web-shared-be/dist/app-directory/app-directory.module";
import { DaoModule } from "@ra/web-core-be/dist/dao/dao.module";
import { FormsModule } from "./forms-data/forms.module";
import { entities } from "./forms-dao/entity/entities";
import { FormsDaoModule } from "./forms-dao/forms-dao.module";
import { FormsSpecModule } from "./forms-spec/forms-spec.module";
import { CompaniesModule } from "@ra/web-shared-be/dist/companies/companies.module";
import { LocatesModule } from "./locates-data/locates-data.module";
import { HubChannelModule } from "./hub-channel/hub-channel.module";
import { SystemChannelModule } from "./system-channel/system-channel.module";

@Module({
    imports: [
        AuthModule.forRoot(
            UserSessionData,
            UserAuthVerify,
        ),
        ObjectRightsModule,
        UsersModule,
        LayoutModule,
        FormsModule,
        LocatesModule,
        HubChannelModule,
        SystemChannelModule,
        DaoModule.forRoot([...entities]),
        FormsDaoModule,
        FormsSpecModule,
        PreferencesModule,
        CompaniesModule,
        AppDirectoryModule,
    ],
    providers: [
    ],
    exports: [
    ],
})
export class AppModule { }
