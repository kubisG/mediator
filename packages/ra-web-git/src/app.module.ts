import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "./config/config.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { FileModule } from "./file/file.module";
import { GitModule } from "./git/git.module";

@Module({
  imports: [
    AuthModule,
    CoreModule,
    EnvironmentsModule,
    ConfigModule,
    FileModule,
    GitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
