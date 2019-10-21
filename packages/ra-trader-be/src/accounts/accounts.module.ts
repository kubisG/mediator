import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { AccountsController } from "./accounts.controller";
import { AccountsService } from "./accounts.service";
import { WebAuthModule } from "../auth/web-auth.module";

@Module({
    imports: [
        CoreModule,
        AuthModule,
        WebAuthModule,
    ],
    controllers: [
        AccountsController,
    ],
    providers: [
        AccountsService,
    ],
})
export class AccountsModule { }
