import "zone.js/dist/zone-error";  // Included with Angular CLI.
import { loggers } from "../app/core/logger/constants";
// import { version, versionLong } from "../config/version";
import { EnvironmentInterface } from "./environment.interface";
import { Modules } from "../module/module.enum";

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: EnvironmentInterface = {
    production: false,
    logging: {
        provider: loggers.ws,
    },
    wsUrl: "http://localhost:3000",
    apiUrl: "http://localhost:3000/api/v1",
    loginTimeout: 30,
    loginIdle: 120000,
    version: "2.0.1",
    versionLong: "2.0.1",
    precision: 4,
    app: Modules.ALL,
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
