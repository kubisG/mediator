import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { FormsSpecService } from "./forms-spec.service";
import { FormsSpecController } from "./forms-spec.controller";
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
        FormsSpecController,
    ],
    providers: [
        FormsSpecService,
    ],
})
export class FormsSpecModule {

}
