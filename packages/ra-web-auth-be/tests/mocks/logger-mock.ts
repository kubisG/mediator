import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { BearerToken } from "../../src/interfaces/bearer-token.interface";

export class LoggerMock implements Logger {

    error(...msg: any): void {
        console.log(msg);
    }

    warn(...msg: any): void {
        console.log(msg);
    }

    info(...msg: any): void {
        console.log(msg);
    }

    verbose(...msg: any): void {
        console.log(msg);
    }

    debug(...msg: any): void {
        console.log(msg);
    }

    silly(...msg: any): void {
        console.log(msg);
    }

    log(level: string, ...msg: any): void {
        console.log(msg);
    }

}
