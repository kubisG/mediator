import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { PortfolioService } from "./portfolio.service";
import { PortfolioController } from "./portfolio.controller";
import { WebAuthModule } from "../auth/web-auth.module";

@Module({
    imports: [
        CoreModule,
        AuthModule,
        WebAuthModule,
    ],
    controllers: [
        PortfolioController,
    ],
    providers: [
        PortfolioService,
    ],
})
export class PortfolioModule { }
