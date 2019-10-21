import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { AuthMockService } from "../../mocks/auth-mock.service";
import { fastRandomFactory } from "@ra/web-core-be/dist/core.provider";
import { LoggerMock } from "../../mocks/logger-mock";
import { JwtService } from "@nestjs/jwt";
import { JwtMockService } from "../../mocks/jwt-mock.service";
import { Subscription } from "rxjs/internal/Subscription";
import { SystemChannelGateway } from "../../../src/system-channel/system-channel.gateway";
import { ExceptionDto } from "../../../src/system-channel/dto/exception.dto";
import { SystemChannelService } from "../../../src/system-channel/system-channel.service";
import { InfoDto } from "../../../src/system-channel/dto/info.dto";

describe("SystemsChannelGateway", () => {

    const socketClient = { handshake: { query: { token: "Token" } }, client: { id: "clientId" } };

    let app: TestingModule;
    let systemsChannelGateWay: SystemChannelGateway;
    let systemChannelService: SystemChannelService;
    let subscriptions: Subscription[] = [];

    beforeAll(async () => {
        app = await Test.createTestingModule({
            providers: [
                fastRandomFactory,
                SystemChannelGateway,
                SystemChannelService,
                {
                    provide: AuthService,
                    useClass: AuthMockService,
                },
                {
                    provide: "logger",
                    useClass: LoggerMock,
                },
                {
                    provide: JwtService,
                    useClass: JwtMockService,
                }
            ],
        }).compile();
        systemsChannelGateWay = app.get<SystemChannelGateway>(SystemChannelGateway);
        systemChannelService = app.get<SystemChannelService>(SystemChannelService);
    });

    afterEach(() => {
        for (const sub of subscriptions) {
            sub.unsubscribe();
        }
    });

    it("onInfo(client, data)", (done) => {
        systemsChannelGateWay.handleConnection(socketClient, {}).then(() => {
            const result = systemsChannelGateWay.onInfo(socketClient, {});
            result.then((obser) => {
                subscriptions.push(obser.subscribe((msg) => {
                    try {
                        expect(msg).toBeInstanceOf(InfoDto);
                        expect(msg.data.message).toEqual("Info message");
                        done();
                    } catch (ex) {
                        done.fail(ex);
                    }
                }, (err) => {
                    done.fail(err);
                })
                );
                systemChannelService.sendInfo({message: "Info message", userId: 1});
            });
        })
    });

    it("onException(client, data)", (done) => {
        systemsChannelGateWay.handleConnection(socketClient, {}).then(() => {
            const result = systemsChannelGateWay.onException(socketClient, {});
            result.then((obser) => {
                subscriptions.push(obser.subscribe((msg) => {
                    try {
                        expect(msg).toBeInstanceOf(ExceptionDto);
                        expect(msg.data).toEqual("Exception message");
                        done();
                    } catch (ex) {
                        done.fail(ex);
                    }
                }, (err) => {
                    done.fail(err);
                })
                );
                systemChannelService.sendException({message: "Exception message", userId: 1});
            });
        });
    });

    it("handleConnection(client: any, ...args: any[])", async () => {
        await systemsChannelGateWay.handleConnection(socketClient, {});
        const subject = systemChannelService.getSubscriptions();

        expect(subject[socketClient.client.id]).toBeDefined();
    });

    it("handleDisconnect(client: any, ...args: any[])", async () => {
        await systemsChannelGateWay.handleConnection(socketClient, {});
        await systemsChannelGateWay.handleDisconnect(socketClient);
        try {
            const subject = systemChannelService.getSubscriptions();
            expect(subject[socketClient.client.id]).not.toBeDefined();
        } catch (ex) {
            expect(ex).toBeInstanceOf(Error);
        }
    });

});
