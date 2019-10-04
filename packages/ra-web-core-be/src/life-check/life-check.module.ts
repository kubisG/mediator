import { Module } from "@nestjs/common";
import { DatabaseHealthIndicator } from "./database-health-indicator";

@Module({
    providers: [
        DatabaseHealthIndicator,
    ],
    exports: [
        DatabaseHealthIndicator,
    ],
})
export class LifeCheckModule {

}
