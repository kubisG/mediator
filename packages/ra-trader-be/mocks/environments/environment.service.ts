import { Substitute, Arg } from "@fluffy-spoon/substitute";
import { EnvironmentService } from "../../src/environments/environment.service";
import { mock, instance, when, verify } from "ts-mockito";

export function getEnvMock(): EnvironmentService {
    const env = mock<EnvironmentService>(EnvironmentService);
    when(env.queue).thenReturn({
        type: "test",
        prefixTrader: "prefixTr_",
        prefixBroker: "prefixBr_",
        workersQ: "worker",
        opt: {
            broker: {
                host: "localhost",
                port: 123,
                exchange: "test",
                qTrader: "testTr",
                qBroker: "testBr",
                user: "mq",
                password: "mq",
                heartbeat: 10,
            },
            trader: {
                host: "localhost",
                port: 123,
                exchange: "test",
                qTrader: "testTr",
                qBroker: "testBr",
                user: "mq",
                password: "mq",
                heartbeat: 10,
            },
        }
    });
    return instance(env);
}

export function getEnvironmentService() {
    const environmentService = Substitute.for<EnvironmentService>();
    environmentService.queue.returns({
        type: "test",
        prefixTrader: "prefixTr",
        prefixBroker: "prefixBr",
        workersQ: "worker",
        opt: {
            broker: {
                host: "localhost",
                port: 123,
                exchange: "test",
                qTrader: "testTr",
                qBroker: "testBr",
                user: "mq",
                password: "mq",
                heartbeat: 10,
            },
            trader: {
                host: "localhost",
                port: 123,
                exchange: "test",
                qTrader: "testTr",
                qBroker: "testBr",
                user: "mq",
                password: "mq",
                heartbeat: 10,
            },
        },
    });
    environmentService.auth.returns({ expiresIn: 1000, secretKey: "test", sessionStore: 0 });
    return environmentService;
}
