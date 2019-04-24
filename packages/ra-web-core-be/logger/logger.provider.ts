import { ConsoleLogger } from "./providers/console-logger";
import { LoggerGateway } from "./logger.gateway";
import { VoidLogger } from "./providers/void-logger";
import { loggers } from "./constants";
import { EnvironmentService } from "../../environments/environment.service";

export const loggerFactory = {
    provide: "logger",
    useFactory: (env: EnvironmentService) => {
        switch (env.logging.provider) {
            case loggers.console: {
                return new ConsoleLogger();
            }
            case loggers.void: {
                return new VoidLogger();
            }
            default: {
                return new VoidLogger();
            }
        }
    },
    inject: [EnvironmentService],
};

export const remoteLoggingGateway = [
    ...(EnvironmentService.instance.logging.remote ? [LoggerGateway] : []),
];
