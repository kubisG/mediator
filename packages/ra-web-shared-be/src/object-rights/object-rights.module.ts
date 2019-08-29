import { Module } from "@nestjs/common";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { ObjectRightsController } from "./object-rights.controller";
import { ObjectRightsService } from "./object-rights.service";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";
import { CoreModule } from "@ra/web-core-be/dist/core.module";

@Module({
    imports: [
        CoreModule,
        AuthModule,
        EnvironmentsModule,
    ],
    controllers: [
        ObjectRightsController,
    ],
    providers: [
        ObjectRightsService,
    ],
})
export class ObjectRightsModule { }
