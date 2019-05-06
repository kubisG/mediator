import { Logger } from "./logger";

export class ConsoleLogger implements Logger {

    public enableLogging(enabled: boolean): void {

    }

    public error(msg: any): void {
        console.log("error:", msg);
    }

    public warn(msg: any): void {
        console.log("warn:", msg);
    }

    public info(msg: any): void {
        console.log("info:", msg);
    }

    public verbose(msg: any): void {
        console.log("verbose:", msg);
    }

    public debug(msg: any): void {
        console.log("debug:", msg);
    }

    public silly(msg: any): void {
        console.log("silly:", msg);
    }


}
