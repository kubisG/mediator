import { Module } from "@nestjs/common";
import { AuthModule } from "@ra/web-auth-be/auth.module";
import { DaoModule } from "@ra/web-core-be/dao/dao.module";
import { LayoutController } from "./layout.controller";
import { LayoutService } from "./layout.service";

@Module({
    imports: [
        AuthModule,
        DaoModule,
    ],
    controllers: [
        LayoutController,
    ],
    providers: [
        LayoutService,
    ],
})
export class LayoutModule { }
