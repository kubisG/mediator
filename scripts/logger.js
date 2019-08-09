"use strict";
exports.__esModule = true;
var winston = require("winston");
var customMessageFormat = winston.format.printf(function (info) {
    var messageWithStackTrace = "[" + info.timestamp + "] [" + info.level + "] - " + info.message + " \n StackTrace: \n " + info.stackTrace;
    var messageWithoutStackTrace = "[" + info.timestamp + "] [" + info.level + "] - " + info.message;
    return (info.stackTrace) ? messageWithStackTrace : messageWithoutStackTrace;
});
var winstonLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: "silly",
            format: winston.format.combine(winston.format(function (info) {
                info.level = info.level.toUpperCase();
                return info;
            })(), winston.format.colorize({ all: true }), winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), customMessageFormat)
        }),
    ],
    exitOnError: false
});
exports.Logger = winstonLogger;
