import { Amqp } from "@ra/web-queue/dist/providers/amqp";
import { Queue } from "@ra/web-queue/dist/providers/queue.interface";
import { queueType } from "@ra/web-queue/dist/constants";
import { LoggerService } from "@ra/web-core-be/dist/logger/logger.service";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { Options } from "amqplib";

export const closeHandlers: (() => Promise<void>)[] = [];

export const queueFactory = [{
    provide: "queueTrader",
    providedIn: "root",
    useFactory: async (
        loggerService: LoggerService,
        env: EnvironmentService,
    ): Promise<Queue> => {
        let queue: Queue;
        const connect: Options.Connect = {
            protocol: "amqp",
            hostname: env.queue.opt.trader.host,
            port: env.queue.opt.trader.port,
            username: env.queue.opt.trader.user,
            password: env.queue.opt.trader.password,
            heartbeat: Number(env.queue.opt.trader.heartbeat),
        };
        switch (env.queue.type) {
            case queueType.ampq: {
                queue = new Amqp(loggerService.logger, connect);
                break;
            }
            default: {
                queue = new Amqp(loggerService.logger, connect);
                break;
            }
        }
        await queue.connect();
        closeHandlers.push(async () => {
            loggerService.logger.warn(`Closing queueTrader`);
            // await queue.close();
        });
        return queue;
    },
    inject: [LoggerService, EnvironmentService],
}, {
    provide: "queueBroker",
    providedIn: "root",
    useFactory: async (
        loggerService: LoggerService,
        env: EnvironmentService,
    ): Promise<Queue> => {
        let queue: Queue;
        const connect: Options.Connect = {
            protocol: "amqp",
            hostname: env.queue.opt.broker.host,
            port: env.queue.opt.broker.port,
            username: env.queue.opt.broker.user,
            password: env.queue.opt.broker.password,
            heartbeat: Number(env.queue.opt.broker.heartbeat),
        };
        switch (env.queue.type) {
            case queueType.ampq: {
                queue = new Amqp(loggerService.logger, connect);
                break;
            }
            default: {
                queue = new Amqp(loggerService.logger, connect);
                break;
            }
        }
        await queue.connect();
        closeHandlers.push(async () => {
            loggerService.logger.warn(`Closing queueBroker`);
            // await queue.close();
        });
        return queue;
    },
    inject: [LoggerService, EnvironmentService],
}];
