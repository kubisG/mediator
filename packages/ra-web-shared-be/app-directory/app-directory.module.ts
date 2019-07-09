import { Module } from "@nestjs/common";
import { DaoModule } from "@ra/web-core-be/dao/dao.module";
import { AppDirectoryController } from "./app-directory.controller";
import { AuthModule } from "@ra/web-auth-be/auth.module";
import { AppDirectoryService } from "./app-directory.service";
import { RaAppDirectory } from "./entities/ra-app-directory";
import { RaAppDirectoryIntent } from "./entities/ra-app-directory-intent";

@Module({
    imports: [
        AuthModule,
        DaoModule.forRoot([
            RaAppDirectory,
            RaAppDirectoryIntent,
        ]),
    ],
    controllers: [
        AppDirectoryController,
    ],
    providers: [
        AppDirectoryService,
    ],
    exports: [
        AppDirectoryService,
    ],
})
export class AppDirectoryModule { }
