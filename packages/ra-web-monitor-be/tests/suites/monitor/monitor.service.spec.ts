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
import { Subject } from "rxjs/internal/Subject";
import { Subscription } from "rxjs/internal/Subscription";

describe("MonitorService", () => {

    const socketClient = { handshake: { query: { token: "Token" } }, client: { id: "clientId" } };

    let app;
    let monitorService;
    let clientRouter;
    const subscriptions = [];

    beforeAll(async () => {
        app = await Test.createTestingModule({
            providers: [
                fastRandomFactory,
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
                }
            ],
        }).compile();
        monitorService = app.get<MonitorService>(MonitorService);
        clientRouter = app.get<MonitorClientRouterService>(MonitorClientRouterService);
    });

    afterEach(() => {
        for (const sub of subscriptions) {
            sub.unsubscribe();
        }
    });

    it("public async addClient(client: any)", async () => {
        await monitorService.addClient(socketClient);
        const subject = clientRouter.getClientSubject("clientId");
        expect(subject).toBeInstanceOf(Subject);
    });

    it("removeClient(client: SocketClient)", async () => {
        await monitorService.addClient(socketClient);
        await monitorService.removeClient(socketClient)
        try {
            const subject = clientRouter.getClientSubject("clientId");
        } catch (ex) {
            expect(ex).toBeInstanceOf(Error);
        }
    });

    it("removeClient(client: SocketClient) - message", (done) => {
        const queue: QueueMock = app.get<QueueMock>("queue");
        monitorService.addClient(socketClient).then(() => {
            monitorService.removeClient(socketClient);
            subscriptions.push(queue.sendedMessages$.subscribe((msg) => {
                try {
                    expect(isNaN(msg.id)).toBe(false);
                    expect(msg.clientId).toEqual("clientId");
                    expect(msg.type).toEqual("unsubscribe");
                    done();
                } catch (ex) {
                    done.fail(ex);
                }
            }, (err) => {
                done.fail(err);
            }));
        });
    });

    it("getClientSubject(client: SocketClient)", async () => {
        await monitorService.addClient(socketClient);
        const subject = monitorService.getClientSubject(socketClient);
        expect(subject).toBeInstanceOf(Subject);
    });

});
