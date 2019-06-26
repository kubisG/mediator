import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { AuthModule } from "@ra/web-auth-be/auth.module";
import { DaoModule } from "@ra/web-core-be/dao/dao.module";
import { UserSessionData } from "./user-session-data";
import { UserAuthVerify } from "./user-auth-verify";

@Module({
    imports: [
        AuthModule.forRoot(
            UserSessionData,
            UserAuthVerify
        ),
        DaoModule,
    ],
    controllers: [
        UsersController,
    ],
    providers: [
        UsersService,
    ],
})
export class UsersModule {

}
