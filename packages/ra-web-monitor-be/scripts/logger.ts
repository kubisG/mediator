import * as winston from "winston";

const customMessageFormat = winston.format.printf((info) => {
    const messageWithStackTrace: string =
        `[${info.timestamp}] [${info.level}] - ${info.message} \n StackTrace: \n ${info.stackTrace}`;
    const messageWithoutStackTrace: string = `[${info.timestamp}] [${info.level}] - ${info.message}`;
    return (info.stackTrace) ? messageWithStackTrace : messageWithoutStackTrace;
});

const winstonLogger = winston.createLogger({
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

export const Logger = winstonLogger;
