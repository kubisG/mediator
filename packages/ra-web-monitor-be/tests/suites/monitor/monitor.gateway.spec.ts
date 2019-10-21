import { Test, TestingModule } from "@nestjs/testing";
import { MonitorService } from "../../../src/monitor/monitor.service";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { AuthMockService } from "../../mocks/auth-mock.service";
import { fastRandomFactory } from "@ra/web-core-be/dist/core.provider";
import { MonitorClientRouterService } from "../../../src/monitor/monitor-client-router.service";
import { ClientRouterMockService } from "../../mocks/client-router-mock.service";
import { QueueMock } from "../../mocks/queue-mock";
import { LoggerMock } from "../../mocks/logger-mock";
import { MonitorMessageRouterService } from "../../../src/monitor/monitor-message-router.service";
import { BaseMessageRouterMock } from "../../mocks/base-message-router-mock.service";
import { MonitorGateWay } from "../../../src/monitor/monitor.gateway";
import { JwtService } from "@nestjs/jwt";
import { JwtMockService } from "../../mocks/jwt-mock.service";
import { Subject } from "rxjs/internal/Subject";
import { Subscription } from "rxjs/internal/Subscription";

describe("MonitorGateway", () => {

    const socketClient = { handshake: { query: { token: "Token" } }, client: { id: "clientId" } };

    let app;
    let monitorGateWay;
    let clientRouter;
    let subscriptions = [];

    beforeAll(async () => {
        app = await Test.createTestingModule({
            providers: [
                fastRandomFactory,
                MonitorGateWay,
                MonitorService,
                {
                    provide: AuthService,
                    useClass: AuthMockService,
                },
                {
                    provide: MonitorClientRouterService,
                    useClass: ClientRouterMockService,
                },
                {
                    provide: "queue",
                    useClass: QueueMock,
                },
                {
                    provide: "logger",
                    useClass: LoggerMock,
                },
                {
                    provide: MonitorMessageRouterService,
                    useClass: BaseMessageRouterMock,
                },
                {
                    provide: JwtService,
                    useClass: JwtMockService,
                }
            ],
        }).compile();
        monitorGateWay = app.get<MonitorGateWay>(MonitorGateWay);
        clientRouter = app.get<MonitorClientRouterService>(MonitorClientRouterService);
    });

    afterEach(() => {
        for (const sub of subscriptions) {
            sub.unsubscribe();
        }
    });

    it("onResponse(client, data)", async () => {
        await monitorGateWay.handleConnection(socketClient, {});
        const result = await monitorGateWay.onResponse(socketClient, {});
        expect(result).toBeInstanceOf(Subject);
    });

    it("onRequest(client, data)", (done) => {
        monitorGateWay.handleConnection(socketClient, {}).then(() => {
            monitorGateWay.onRequest(socketClient, { test: "test" });
            const queue: QueueMock = app.get<QueueMock>("queue");
            subscriptions.push(queue.sendedMessages$.subscribe((msg) => {
                try {
                    expect(isNaN(msg.id)).toBe(false);
                    expect(msg.clientId).toEqual("clientId");
                    expect(msg.test).toEqual("test");
                    done();
                } catch (ex) {
                    done.fail(ex);
                }
            }, (err) => {
                done.fail(err);
            }));
        });
    });

    it("handleConnection(client: any, ...args: any[])", async () => {
        await monitorGateWay.handleConnection(socketClient, {});
        const subject = clientRouter.getClientSubject("clientId");
        expect(subject).toBeInstanceOf(Subject);
    });

    it("handleDisconnect(client: any, ...args: any[])", async () => {
        await monitorGateWay.handleConnection(socketClient, {});
        await monitorGateWay.handleDisconnect(socketClient);
        try {
            const subject = clientRouter.getClientSubject("clientId");
        } catch (ex) {
            expect(ex).toBeInstanceOf(Error);
        }
    });

});
