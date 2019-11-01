import { Module } from "@nestjs/common";

import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersGateway } from "./users.gateway";
import { WebAuthModule } from "../auth/web-auth.module";
@Module({
    imports: [
        CoreModule,
        AuthModule,
        WebAuthModule,
    ],
    controllers: [
        UsersController,
    ],
    providers: [
        UsersService,
        UsersGateway,
    ],
})
export class UsersModule { }
