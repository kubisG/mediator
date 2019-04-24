import * as winston from "winston";
import { Logger } from "./logger";

export class ConsoleLogger implements Logger {

    private logger: winston.Logger;

    constructor() {
        this.init();
    }

    private init() {
        const customMessageFormat = winston.format.printf((info) => {
            const messageWithStackTrace: string =
                `[${info.timestamp}] [${info.level}] - ${info.message} \n StackTrace: \n ${info.stackTrace}`;
            const messageWithoutStackTrace: string = `[${info.timestamp}] [${info.level}] - ${info.message}`;
            return (info.stackTrace) ? messageWithStackTrace : messageWithoutStackTrace;
        });

        this.logger = winston.createLogger({
            transports: [
                new winston.transports.Console({
                    level: "silly",
                    format: winston.format.combine(
                        winston.format((info) => {
                            info.level = info.level.toUpperCase();
                            return info;
                        })(),
                        winston.format.colorize({ all: true }),
                        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                        customMessageFormat),
                }),
            ],
            exitOnError: false,
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
