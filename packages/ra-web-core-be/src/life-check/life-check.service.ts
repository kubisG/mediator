import { Injectable } from "@nestjs/common";
import {
    TerminusOptionsFactory,
    TerminusModuleOptions,
    TerminusEndpoint,
} from "@nestjs/terminus";
import { DatabaseHealthIndicator } from "./database-health-indicator";

@Injectable()
export class LifeCheckService implements TerminusOptionsFactory {

    constructor(
        private readonly databaseHealthIndicator: DatabaseHealthIndicator,
    ) { }

    createTerminusOptions(): TerminusModuleOptions | Promise<TerminusModuleOptions> {
        const healthEndpoint: TerminusEndpoint = {
            url: "/health",
            healthIndicators: [
                async () => this.databaseHealthIndicator.isHealthy("db"),
            ],
        };
        return {
            endpoints: [healthEndpoint],
        };
    }

}
