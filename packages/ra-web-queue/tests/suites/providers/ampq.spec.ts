import { Test, TestingModule } from "@nestjs/testing";
import { LoggerMock } from "../../mocks/logger-mock";
import { Subscription } from "rxjs/internal/Subscription";
import { Amqp } from "../../../src/providers/amqp";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { EnvironmentMockService } from "../../mocks/environment-mock.service";
import { AmpqConnectionMock } from "../../mocks/ampqChannel-mock";

describe("amqp()", () => {
    let app: TestingModule;
    let service: Amqp;
    const subscriptions: Subscription[] = [];

    beforeAll(async () => {
        app = await Test.createTestingModule({
            providers: [
                {
                    provide: EnvironmentService,
                    useClass: EnvironmentMockService,
                },
                {
                    provide: "logger",
                    useClass: LoggerMock,
                }
            ],
        }).compile();

        const env = new EnvironmentService();
        const logger = new LoggerMock();

        service = new Amqp(logger, (env as any));
        const ampqMock = new AmpqConnectionMock(env);

        service.setDriver((config) => {
            return Promise.resolve(ampqMock);
        });
        await service.connect();
    });

    afterEach(() => {
        for (const sub of subscriptions) {
            sub.unsubscribe();
        }
    });


    describe("consumeQueue()", () => {
        it("test consuming data", (done) => {
            service.consumeQueue("testq").subscribe((data) => {
                try {
                    expect({
                        test: "test",
                        fields:
                        {
                            deliveryTag: 0,
                            redelivered: false,
                            exchange: null,
                            routingKey: null,
                            messageCount: "1",
                        },
                    }).toEqual(data);
                    done();
                } catch (ex) {
                    done.fail(ex);
                }
            });
            service.sendToQueue({ test: "test" }, "testq");
        });
    });
});

