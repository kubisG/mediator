import { Logger } from "./logger";

export class VoidLogger implements Logger {

    public error(...msg: any): void {

    }

    public warn(...msg: any): void {

    }

    public info(...msg: any): void {

    }

    public verbose(...msg: any): void {

    }

    public debug(...msg: any): void {

    }

    public silly(...msg: any): void {

    }

    log(level: string, ...msg: any): void {

    }

}
