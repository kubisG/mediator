import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { ClientProxyFactory, Transport, ClientProxy, Closeable } from "@nestjs/microservices";

export const clientProxyProviders = [
    {
        provide: "clientProxy",
        useFactory: async (env: EnvironmentService): Promise<ClientProxy & Closeable> => {
            // const connectioString = `amqp://${env.queue.opt.trader.user}`
            //     + `:${env.queue.opt.trader.password}`
            //     + `@${env.queue.opt.trader.host}`
            //     + `:${env.queue.opt.trader.port}`;
            const proxyClient = ClientProxyFactory.create({
                transport: Transport.REDIS,
                options: {
                    url: `redis://${env.redis.host}:${env.redis.port}`,
                    // urls: [connectioString],
                    // queue: env.queue.workersQ,
                },
            });
            await proxyClient.connect();
            return proxyClient;
        },
        inject: [EnvironmentService],
    },
];
