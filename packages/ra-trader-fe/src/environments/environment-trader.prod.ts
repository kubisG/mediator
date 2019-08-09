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
    version: "2.0.1",
    versionLong: "2.0.1",
    precision: 4,
    app: Modules.TRADER,
};
