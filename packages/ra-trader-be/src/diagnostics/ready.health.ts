import { HealthIndicator } from "@nestjs/terminus/dist/health-indicators/health-indicator";
import { Injectable } from "@nestjs/common";
import { DiagnosticsService } from "../diagnostics/diagnostics.service";
import { HealthIndicatorResult } from "@nestjs/terminus";

@Injectable()
export class ReadyHealthIndicator extends HealthIndicator {

    constructor(
        private diagnosticsService: DiagnosticsService,
    ) {
        super();
    }

    async check(): Promise<HealthIndicatorResult> {
        return this.getStatus("test", true);
    }

}
