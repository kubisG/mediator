import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { LocatesService } from "./locates-data.service";
import { LocatesDataController } from "./locates-data.controller";
import { DataService } from "./data.service";
import { FormsDaoModule } from "../forms-dao/forms-dao.module";
import { SystemChannelModule } from "../system-channel/system-channel.module";

@Module({
    imports: [
        CoreModule,
        AuthModule,
        SystemChannelModule,
        FormsDaoModule,
    ],
    controllers: [
        LocatesDataController,
    ],
    providers: [
        LocatesService,
        DataService,
    ],
})
export class LocatesModule {

}
