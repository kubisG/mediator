import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { CounterPartyController } from "./counter-party.controller";
import { CounterPartyService } from "./counter-party.service";
import { WebAuthModule } from "../auth/web-auth.module";
@Module({
    imports: [
        CoreModule,
        AuthModule,
        WebAuthModule,
    ],
    controllers: [
        CounterPartyController,
    ],
    providers: [
        CounterPartyService,
    ],
})
export class CounterPartyModule { }
