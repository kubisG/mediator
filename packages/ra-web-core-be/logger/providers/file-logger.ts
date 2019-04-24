import * as winston from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";
import { Logger } from "./logger";

export class FileLogger implements Logger {

    private logger: winston.Logger;

    constructor() {
        this.init();
    }

    private init() {
        const transport = new (DailyRotateFile)({
            filename: "ra-trader-%DATE%.log",
            dirname: "./logs",
            datePattern: "YYYY-MM-DD-HH",
            zippedArchive: true,
            maxSize: "5m",
            maxFiles: "1d"
        });

        this.logger = winston.createLogger({
            transports: [
                transport
            ]
        });
    }

    public error(...msg: any): void {
        this.logger.log({
            level: "error",
            message: msg
        });
    }

    public warn(...msg: any): void {
        this.logger.log({
            level: "warn",
            message: msg
        });
    }

    public info(...msg: any): void {
        this.logger.log({
            level: "info",
            message: msg
        });
    }

    public verbose(...msg: any): void {
        this.logger.log({
            level: "verbose",
            message: msg
        });
    }

    public debug(...msg: any): void {
        this.logger.log({
            level: "debug",
            message: msg
        });
    }

    public silly(...msg: any): void {
        this.logger.log({
            level: "silly",
            message: msg
        });
    }

    log(level: string, ...msg: any): void {
        this.logger.log({
            level: level,
            message: msg
        });
    }

}
