import { HealthIndicator, HealthIndicatorResult } from "@nestjs/terminus";
import { Injectable, Inject } from "@nestjs/common";
import { Connection } from "typeorm";
import { HealthCheckError } from "@godaddy/terminus";

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {

    constructor(@Inject("DbConnection") public dbConnect: () => Connection) {
        super();
    }

    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        try {
            const dbResult = await this.dbConnect().manager.query("SELECT * FROM now();");
            return this.getStatus(key, true, { timestamp: dbResult });
        } catch (ex) {
            throw new HealthCheckError("DbCheck failed", this.getStatus(key, false, { error: ex }));
        }
    }

}
