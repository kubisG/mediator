import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { CompaniesService } from "./companies.service";
import { CompaniesController } from "./companies.controller";

@Module({
    imports: [
        CoreModule,
        AuthModule,
    ],
    controllers: [
        CompaniesController,
    ],
    providers: [
        CompaniesService,
    ]
})
export class CompaniesModule { }
