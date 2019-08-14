import { Module, Global } from "@nestjs/common";
import { EnvironmentService } from "./environment.service";

@Module({
    imports: [],
    controllers: [],
    providers: [EnvironmentService],
    exports: [EnvironmentService],
})
export class EnvironmentsModule { }
