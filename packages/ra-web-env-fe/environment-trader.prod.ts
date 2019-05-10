import { loggers } from "../app/core/logger/constants";
import { EnvironmentInterface } from "./environment.interface";
import { Modules } from "../module/module.enum";

export const environment: EnvironmentInterface = {
    production: true,
    logging: {
        provider: loggers.ws,
    },
    wsUrl: "",
    apiUrl: "/api/v1",
    loginTimeout: 30,
    loginIdle: 120000,
    version: "1.1.0",
    versionLong: "1.1.0",
    precision: 4,
    app: Modules.TRADER,
};
