import { Module } from "@nestjs/common";
import { AppDirectoryController } from "./app-directory.controller";
import { AuthModule } from "@ra/web-auth-be/auth.module";
import { AppDirectoryService } from "./app-directory.service";
import { repositoriesProvider } from "./dao/dao.provider";

@Module({
    imports: [
        AuthModule,
    ],
    controllers: [
        AppDirectoryController,
    ],
    providers: [
        AppDirectoryService,
        ...repositoriesProvider,
    ],
    exports: [
        AppDirectoryService,
        ...repositoriesProvider,
    ],
})
export class AppDirectoryModule { }
