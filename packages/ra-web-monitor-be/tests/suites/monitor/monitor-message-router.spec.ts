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
import { MonitorGateWay } from "../../../src/monitor/monitor.gateway";
import { JwtService } from "@nestjs/jwt";
import { JwtMockService } from "../../mocks/jwt-mock.service";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { EvironmentMockService } from "../../mocks/environment-mock.service";
import { DataResponseDto } from "../../../src/monitor/dto/response/data-response.dto";
import { WsDataDto } from "../../../src/monitor/dto/ws-data.dto";
import { PageResponse } from "../../../src/monitor/dto/response/page-response.dto";
import { WsPageDto } from "../../../src/monitor/dto/ws-page.dto";
import { SubscribeErrResponseDto } from "../../../src/monitor/dto/response/subscribe-err-response.dto";
import { WsSubscribeErrDto } from "../../../src/monitor/dto/ws-subscribe-err.dto";
import { SubscribeOkResponse } from "../../../src/monitor/dto/response/subscribe-ok-response.dto";
import { WsSubscribeOkDto } from "../../../src/monitor/dto/ws-subscribe-ok.dto";
import { InitOkResponse } from "../../../src/monitor/dto/response/init-ok-response.dto";
import { WsInitOkDto } from "../../../src/monitor/dto/ws-init-ok.dto";

describe("MonitorMessageRouter", () => {

    const socketClient = { handshake: { query: { token: "Token" } }, client: { id: "clientId" } };

    let app: TestingModule;
    let monitorMessageRouterService: MonitorMessageRouterService;
    let clientRouter: MonitorClientRouterService;
    let subscriptions = [];

    beforeAll(async () => {
        app = await Test.createTestingModule({
            providers: [
                fastRandomFactory,
                MonitorGateWay,
                MonitorService,
                MonitorMessageRouterService,
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
                    provide: JwtService,
                    useClass: JwtMockService,
                },
                {
                    provide: "inMiddlewares",
                    useValue: [],
                },
                {
                    provide: "outMiddlewares",
                    useValue: [],
                },
                {
                    provide: EnvironmentService,
                    useClass: EvironmentMockService,
                }
            ],
        }).compile();
        clientRouter = app.get<MonitorClientRouterService>(MonitorClientRouterService);
        monitorMessageRouterService = app.get<MonitorMessageRouterService>(MonitorMessageRouterService);
    });

    afterEach(() => {
        for (const sub of subscriptions) {
            sub.unsubscribe();
        }
    });

    it("unsubscribeAll()", (done) => {
        monitorMessageRouterService.unsubscribeAll();
        const queue: QueueMock = app.get<QueueMock>("queue");
        subscriptions.push(queue.sendedMessages$.subscribe((msg) => {
            try {
                expect(isNaN(msg.id)).toBe(false);
                expect(msg.type).toEqual("unsubscribeAll");
                done();
            } catch (ex) {
                done.fail(ex);
            }
        }, (err) => {
            done.fail(err);
        }));
    });

    it("pushData(clientId: string, msg: DataResponseDto)", (done) => {
        clientRouter.addClientToAccount(socketClient.client.id, `1`);
        const response = new DataResponseDto();
        response.id = `1`;
        response.hosts = [{ channelId: "channelId", clientId: "clientId" }];
        response.data = [{ test: "test" }];
        const cilentSubject = clientRouter.getClientSubject(socketClient.client.id);
        subscriptions.push(cilentSubject.subscribe((msg: WsDataDto) => {
            try {
                expect(msg).toBeInstanceOf(WsDataDto);
                expect(msg.event).toEqual("data");
                expect(msg.data).toBeInstanceOf(DataResponseDto);
                expect(msg.data.type).toEqual("data");
                expect(msg.data.id).toEqual("1");
                expect(msg.data.hosts).toEqual([{ channelId: "channelId", clientId: "clientId" }]);
                done();
            } catch (ex) {
                done.fail(ex);
            }
        }, (err) => {
            done.fail(err);
        }));
        (monitorMessageRouterService as any).pushData(socketClient.client.id, response);
    });

    it("pushPage(clientId: string, msg: PageResponse)", (done) => {
        clientRouter.addClientToAccount(socketClient.client.id, `1`);
        const response = new PageResponse();
        response.id = `1`;
        response.hosts = [{ channelId: "channelId", clientId: "clientId" }];
        response.newPage = 1;
        response.newPageCount = 2;
        const cilentSubject = clientRouter.getClientSubject(socketClient.client.id);
        subscriptions.push(cilentSubject.subscribe((msg: WsPageDto) => {
            try {
                expect(msg).toBeInstanceOf(WsPageDto);
                expect(msg.event).toEqual("page");
                expect(msg.data).toBeInstanceOf(PageResponse);
                expect(msg.data.type).toEqual("page");
                expect(msg.data.id).toEqual("1");
                expect(msg.data.hosts).toEqual([{ channelId: "channelId", clientId: "clientId" }]);
                expect(msg.data.newPage).toEqual(1);
                expect(msg.data.newPageCount).toEqual(2);
                done();
            } catch (ex) {
                done.fail(ex);
            }
        }, (err) => {
            done.fail(err);
        }));
        (monitorMessageRouterService as any).pushPage(socketClient.client.id, response);
    });

    it("pushSubscribeErr(clientId: string, msg: SubscribeErrResponseDto)", (done) => {
        clientRouter.addClientToAccount(socketClient.client.id, `1`);
        const response = new SubscribeErrResponseDto();
        response.id = `1`;
        response.clientId = "clientId";
        response.channelId = "channelId";
        response.error = "error";
        const cilentSubject = clientRouter.getClientSubject(socketClient.client.id);
        subscriptions.push(cilentSubject.subscribe((msg: WsSubscribeErrDto) => {
            try {
                expect(msg).toBeInstanceOf(WsSubscribeErrDto);
                expect(msg.event).toEqual("subscribeErr");
                expect(msg.data).toBeInstanceOf(SubscribeErrResponseDto);
                expect(msg.data.type).toEqual("subscribeerr");
                expect(msg.data.id).toEqual("1");
                expect(msg.data.clientId).toEqual("clientId");
                expect(msg.data.channelId).toEqual("channelId");
                expect(msg.data.error).toEqual("error");
                done();
            } catch (ex) {
                done.fail(ex);
            }
        }, (err) => {
            done.fail(err);
        }));
        (monitorMessageRouterService as any).pushSubscribeErr(socketClient.client.id, response);
    });

    it("pushSubscribeOk(clientId: string, msg: SubscribeOkResponse)", (done) => {
        clientRouter.addClientToAccount(socketClient.client.id, `1`);
        const response = new SubscribeOkResponse();
        response.id = `1`;
        response.clientId = "clientId";
        response.channelId = "channelId";
        response.columns = [1];
        response.snapshot = [2];
        const cilentSubject = clientRouter.getClientSubject(socketClient.client.id);
        subscriptions.push(cilentSubject.subscribe((msg: WsSubscribeOkDto) => {
            try {
                expect(msg).toBeInstanceOf(WsSubscribeOkDto);
                expect(msg.event).toEqual("subscribeOk");
                expect(msg.data).toBeInstanceOf(SubscribeOkResponse);
                expect(msg.data.type).toEqual("subscribeok");
                expect(msg.data.id).toEqual("1");
                expect(msg.data.clientId).toEqual("clientId");
                expect(msg.data.channelId).toEqual("channelId");
                expect(msg.data.columns).toEqual([1]);
                expect(msg.data.snapshot).toEqual([2]);
                done();
            } catch (ex) {
                done.fail(ex);
            }
        }, (err) => {
            done.fail(err);
        }));
        (monitorMessageRouterService as any).pushSubscribeOk(socketClient.client.id, response);
    });

    it("pushInitOk(clientId: string, msg: InitOkResponse)", (done) => {
        clientRouter.addClientToAccount(socketClient.client.id, `1`);
        const response = new InitOkResponse();
        response.id = `1`;
        response.clientId = "clientId";
        response.stores = [1];
        const cilentSubject = clientRouter.getClientSubject(socketClient.client.id);
        subscriptions.push(cilentSubject.subscribe((msg: WsInitOkDto) => {
            try {
                expect(msg).toBeInstanceOf(WsInitOkDto);
                expect(msg.event).toEqual("initOk");
                expect(msg.data).toBeInstanceOf(InitOkResponse);
                expect(msg.data.type).toEqual("initok");
                expect(msg.data.id).toEqual("1");
                expect(msg.data.clientId).toEqual("clientId");
                expect(msg.data.stores).toEqual([1]);
                done();
            } catch (ex) {
                done.fail(ex);
            }
        }, (err) => {
            done.fail(err);
        }));
        (monitorMessageRouterService as any).pushInitOk(socketClient.client.id, response);
    });

    it("pushMessage(clientId: string, msg: Response)", (done) => {
        let itr = 0;
        const responses = [
            new DataResponseDto(),
            new PageResponse(),
            new SubscribeErrResponseDto(),
            new SubscribeOkResponse(),
            new InitOkResponse(),
        ];
        const responsesTypes = [
            WsDataDto,
            WsPageDto,
            WsSubscribeErrDto,
            WsSubscribeOkDto,
            WsInitOkDto,
        ];
        clientRouter.addClientToAccount(socketClient.client.id, `1`);
        const cilentSubject = clientRouter.getClientSubject(socketClient.client.id);
        subscriptions.push(cilentSubject.subscribe((msg) => {
            try {
                expect(msg).toBeInstanceOf(responsesTypes[itr]);
                if (itr === 4) {
                    done();
                }
                itr++;
            } catch (ex) {
                done.fail(ex);
            }
        }, (err) => {
            done.fail(err);
        }));
        for (const response of responses) {
            (monitorMessageRouterService as any).pushMessage(socketClient.client.id, response);
        }
    });

    it("routeMessage(msg: Response)", (done) => {

        let itr = 0;

        const responseData = new DataResponseDto();
        responseData.id = `1`;
        responseData.hosts = [{ channelId: "channelId", clientId: "clientId" }];
        responseData.data = [{ test: "test" }];

        const responseErr = new SubscribeErrResponseDto();
        responseErr.id = `1`;
        responseErr.clientId = "clientId";
        responseErr.channelId = "channelId";
        responseErr.error = "error";

        clientRouter.addClientToAccount(socketClient.client.id, `1`);
        const cilentSubject = clientRouter.getClientSubject(socketClient.client.id);
        subscriptions.push(cilentSubject.subscribe((msg) => {
            try {
                if (itr === 1) {
                    done();
                }
                itr++;
            } catch (ex) {
                done.fail(ex);
            }
        }, (err) => {
            done.fail(err);
        }));

        (monitorMessageRouterService as any).pushMessage(socketClient.client.id, responseData);
        (monitorMessageRouterService as any).pushMessage(socketClient.client.id, responseErr);
    });

});
