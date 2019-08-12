import { Module } from "@nestjs/common";
import { AppDirectoryController } from "./app-directory.controller";
import { AuthModule } from "@ra/web-auth-be/auth.module";
import { AppDirectoryService } from "./app-directory.service";
import { repositoriesProvider } from "./dao/dao.provider";
import { JwtModule } from "@nestjs/jwt";
import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { PassportModule } from "@nestjs/passport";
import { CoreModule } from "@ra/web-core-be/core.module";

@Module({
    imports: [
        CoreModule,
        AuthModule,
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.register({
            secret: EnvironmentService.instance.auth.secretKey,
            signOptions: {
                expiresIn: EnvironmentService.instance.auth.expiresIn,
            },
        }),
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
