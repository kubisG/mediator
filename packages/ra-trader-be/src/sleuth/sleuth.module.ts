import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { SleuthService } from "./sleuth.service";
import { SleuthController } from "./sleuth.controller";
import { WebAuthModule } from "../auth/web-auth.module";

@Module({
    imports: [
        CoreModule,
        AuthModule,
        WebAuthModule
    ],
    controllers: [
        SleuthController,
    ],
    providers: [
        SleuthService,
    ]
})
export class SleuthModule { }
