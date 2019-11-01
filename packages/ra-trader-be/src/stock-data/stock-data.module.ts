import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { StockDataService } from "./stock-data.service";
import { StockDataController } from "./stock-data.controller";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { WebAuthModule } from "../auth/web-auth.module";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";

@Module({
    imports: [
        CoreModule,
        AuthModule,
        WebAuthModule,
        EnvironmentsModule,
    ],
    controllers: [
        StockDataController,
    ],
    providers: [
        StockDataService,
    ],
})
export class StockDataModule { }
