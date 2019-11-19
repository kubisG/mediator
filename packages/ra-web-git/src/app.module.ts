import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "./config/config.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";
import { CoreModule } from "@ra/web-core-be/dist/core.module";

@Module({
  imports: [
    AuthModule,
    CoreModule,
    EnvironmentsModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
