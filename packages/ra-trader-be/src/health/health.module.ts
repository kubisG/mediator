import { TerminusModuleOptions, TerminusModule } from "@nestjs/terminus";
import { Module } from "@nestjs/common";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { DiagnosticIndicator } from "./diagnostic.indicator";

const getTerminusOptions = (): TerminusModuleOptions => ({
    endpoints: [
        {
            url: "/health",
            healthIndicators: [
                async () => {
                    return await new DiagnosticIndicator(EnvironmentService.instance).check();
                },
            ],
        },
        {
            url: "/ready",
            healthIndicators: [],
        },
    ],
});

@Module({
    imports: [
        TerminusModule.forRootAsync({
            inject: [],
            useFactory: () => getTerminusOptions(),
        }),
    ],
    providers: [],
})
export class HealthModule { }
