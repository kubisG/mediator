import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { AuthModule } from "@ra/web-auth-be/dist/auth.module";
import { InputRulesController } from "./input-rules.controller";
import { InputRulesService } from "./input-rules.service";
import { WebAuthModule } from "../auth/web-auth.module";

@Module({
    imports: [
        CoreModule,
        AuthModule,
        WebAuthModule,
    ],
    controllers: [
        InputRulesController,
    ],
    providers: [
        InputRulesService,
    ],
})
export class InputRulesModule { }
