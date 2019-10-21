import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { CompaniesService } from "./companies.service";
import { CompaniesController } from "./companies.controller";
import { MessagesModule } from "../messages/messages.module";
import { WebAuthModule } from "../auth/web-auth.module";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";

@Module({
    imports: [
        CoreModule,
        AuthModule,
        MessagesModule,
        WebAuthModule,
        EnvironmentsModule
    ],
    controllers: [
        CompaniesController,
    ],
    providers: [
        CompaniesService,
    ]
})
export class CompaniesModule { }
