import { Module } from "@nestjs/common";
import { AuthModule } from "@ra/web-auth-be/auth.module";
import { LayoutController } from "./layout.controller";
import { LayoutService } from "./layout.service";

@Module({
    imports: [
        AuthModule,
    ],
    controllers: [
        LayoutController,
    ],
    providers: [
        LayoutService,
    ],
})
export class LayoutModule { }
