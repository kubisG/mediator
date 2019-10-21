import { mock, instance, when, verify, spy, anyNumber, anything } from "ts-mockito";
import { getEnvMock } from "../mocks/environments/environment.service";
import { ConsoleLogger } from "@ra/web-core-be/dist/logger/providers/console-logger";
import { Amqp } from "@ra/web-queue/dist/providers/amqp";
import { AmpqConnectionMock } from "../mocks/ampqlib/ampqlib";
import { messagesRouting } from "../src/messages/messages.provider";
import { MessagesRouter } from "../src/messages/routing/messages-router";
import * as fastRandom from "fast-random";
import { CompanyRepository } from "../src/dao/repositories/company.repository";
import { RaCompany } from "../src/entity/ra-company";

describe("Messaging", () => {

    let ampqMock = null;

    const order = {
        Side: "Sell",
        OrderQty: 50,
        OnBehalfOfSubID: "hajekj14@gmail.com",
        SecurityDesc: "HSBA",
        Symbol: "HSBA",
        SecurityID: "HSBA",
        SecurityIDSource: "ISINNumber",
        Price: 10,
        ExDestination: "NEWFIXBROKER",
        TargetCompID: "prefixBr_1",
        BookingType: "RegularBooking",
        RequestType: "Trader",
        TransactTime: "2019-02-20T09:20:05.781Z",
        company: 1,
        SenderCompID: "prefixTr_1",
        userId: 2,
        ClientID: "Rapid Addition",
        msgType: "NewOrderSingle",
        OrdStatus: "PendingNew",
        ClOrdID: "2061911450",
        RaID: "2061911450"
    };

    const userData = {
        email: "hajekj14@gmail.com",
        sid: "aaa910c9-5a11-44ed-90d1-8d3bf8a8785d",
        iat: 1550654359,
        exp: 1550750359,
        compQueue: "prefixTr_1",
        compQueueTrader: "prefixTr_1",
        compQueueBroker: "prefixBr_1",
        compId: 1,
        userId: 2,
        role: "ADMIN",
        companyName: "Rapid Addition",
        nickName: "hajekj14",
        app: 0
    };



    let ampq: Amqp;
    let brokerRouting: MessagesRouter;
    let traderRouting: MessagesRouter;

    function assignToRouter(router: MessagesRouter, name: string) {
        if (name === "brokerRouting") {
            brokerRouting = router;
        } else if (name === "traderRouting") {
            traderRouting = router;
        }
    }

    function getCompanyRepositoryMock() {
        const repo = mock<CompanyRepository>(CompanyRepository);
        when(repo.find()).thenReturn(Promise.resolve([
            { id: 1 },
            { id: 2 },
        ] as RaCompany[]));
        return instance(repo);
    }

    beforeAll(async () => {

        // jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

        const env = getEnvMock();
        const logger = new ConsoleLogger();
        ampq = new Amqp(logger, env);

        ampqMock = new AmpqConnectionMock(env);

        ampq.setDriver((config) => {
            return Promise.resolve(ampqMock);
        });
        await ampq.connect();

        const companyRepo = getCompanyRepositoryMock();

        const routing = messagesRouting;
        for (let i = 0; i < routing.length; i++) {
            const router = await routing[i].useFactory(ampq, logger, fastRandom.default(new Date().getTime()), env, companyRepo);
            assignToRouter(router, routing[i].provide);
        }
    });

    describe("ampq.ts", () => {
        it("test consuming data", (done) => {
            ampq.consumeQueue("testq").subscribe((data) => {
                expect({
                    test: "test",
                    fields:
                    {
                        deliveryTag: 0,
                        redelivered: false,
                        exchange: null,
                        routingKey: null,
                        messageCount: "1"
                    }
                }).toEqual(data);
                done();
            });
            ampq.sendToQueue({ test: "test" }, "testq");
        });
    });

    describe("messages.provider.ts brokerRouting", () => {
        it("test consuming data", (done) => {
            done();
            // brokerRouting.getOrdersSubjects()[order.TargetCompID].subscribe((data) => {
            //     done();
            // });
            // traderRouting.sendUserMessage(order, userData);
        });
    });

});
