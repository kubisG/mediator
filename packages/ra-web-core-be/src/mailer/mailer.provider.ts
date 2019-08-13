import { Smtp } from "./providers/smtp";
import { LoggerService } from "../logger/logger.service";
import { Mailer } from "./providers/mailer.interface";
import { mailerType } from "./constants";
import { EnvironmentService } from "@ra/web-env-be/environment.service";

export const mailerFactory = {
    provide: "mailer",
    useFactory: async (loggerService: LoggerService, env: EnvironmentService): Promise<Mailer> => {
        let mailer: Mailer;
        switch (env.mailer.type) {
            case mailerType.smtp: {
                mailer = new Smtp(loggerService.logger, env);
                break;
            }
            default: {
                mailer = new Smtp(loggerService.logger, env);
                break;
            }
        }
        await mailer.connect();
        return mailer;
    },
    inject: [LoggerService, EnvironmentService],
};
