import { HealthIndicator } from "@nestjs/terminus/dist/health-indicators/health-indicator";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { DiagnosticsService } from "../diagnostics/diagnostics.service";
import { HealthCheckError } from "@godaddy/terminus";

export class DiagnosticIndicator extends HealthIndicator {

    constructor(
        private env: EnvironmentService,
    ) {
        super();
    }

    private generateError(key: string) {
        throw new HealthCheckError(
            key,
            this.getStatus(key, false, {
                message: key,
                statusCode: 500,
                statusText: key,
            }),
        );
    }

    public async check() {
        const diag = new DiagnosticsService(
            this.env,
        );
        const status = await diag.getSystemStatus();
        for (let i = 0; i < status.length; i++) {
            if (!status[i].status) {
                this.generateError(status[i].name);
                return;
            }
        }
        return this.getStatus("all", true);
    }

}
