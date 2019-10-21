import { Queue } from "@ra/web-queue/dist/providers/queue.interface";
import { LoggerService } from "@ra/web-core-be/dist/logger/logger.service";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { Options } from "amqplib";
import { Nats } from "@ra/web-queue/dist/providers/nats";
import { Amqp } from "@ra/web-queue/dist/providers/amqp";
import { TlsOptions } from "tls";

export const queueFactory = {
    provide: "queue",
    useFactory: async (
        loggerService: LoggerService,
        env: EnvironmentService,
    ) => {
        switch (env.queue.type) {
            case "nats": {
                return await createNats(loggerService, env);
            }
            case "amqp": {
                return await createAmqp(loggerService, env);
            }
        }
    },
    inject: [LoggerService, EnvironmentService],
};

async function createNats(
    loggerService: LoggerService,
    env: EnvironmentService,
): Promise<Queue> {
    let queue: Queue;
    const connect: Options.Connect = {
        protocol: "nats",
        hostname: env.queue.opt.nats.host,
        port: env.queue.opt.nats.port,
        username: env.queue.opt.nats.user,
        password: env.queue.opt.nats.password,
        heartbeat: Number(env.queue.opt.nats.heartbeat),
    };
    let tls: TlsOptions;
    if (env.queue.opt.nats.tls.isEnabled()) {
        tls = {
            rejectUnauthorized: env.queue.opt.nats.tls.rejectUnauthorized,
            ca: env.queue.opt.nats.tls.ca(),
            cert: env.queue.opt.nats.tls.cert(),
            key: env.queue.opt.nats.tls.key(),
        };
    }
    queue = new Nats(loggerService.logger, connect, tls);
    await queue.connect();
    return queue;
}

async function createAmqp(
    loggerService: LoggerService,
    env: EnvironmentService,
): Promise<Queue> {
    let queue: Queue;
    const connect: Options.Connect = {
        protocol: "nats",
        hostname: env.queue.opt.nats.host,
        port: env.queue.opt.nats.port,
        username: env.queue.opt.nats.user,
        password: env.queue.opt.nats.password,
        heartbeat: Number(env.queue.opt.nats.heartbeat),
    };
    queue = new Amqp(loggerService.logger, connect);
    await queue.connect();
    return queue;
}
