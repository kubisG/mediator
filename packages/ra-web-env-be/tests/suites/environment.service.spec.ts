import { Test, TestingModule } from "@nestjs/testing";
import { Subscription } from "rxjs/internal/Subscription";
import { EnvironmentService } from "../../src/environment.service";
import { Subject } from "rxjs";

describe("ClientRouterService", () => {
    let app: TestingModule;
    let service: EnvironmentService;
    const subscriptions: Subscription[] = [];

    beforeAll(async () => {
        app = await Test.createTestingModule({
            providers: [
                EnvironmentService,
            ],
        }).compile();
        service = app.get<EnvironmentService>(EnvironmentService);
    });

    afterEach(() => {
        for (const sub of subscriptions) {
            sub.unsubscribe();
        }
    });

    it("mailer()", async () => {
        const settings = service.mailer;
        expect(settings).toBeDefined();
        expect(typeof settings.type).toBe("string");
    });

    it("queue()", async () => {
        const settings = service.queue;
        expect(settings).toBeDefined();
        expect(settings.opt).toBeDefined();
        expect(typeof settings.type).toBe("string");
    });

    it("verifyService()", async () => {
        const settings = service.verifyService;
        expect(settings).toBeDefined();
        expect(typeof settings.provider).toBe("string");
    });

    it("logging()", async () => {
        const settings = service.logging;
        expect(settings).toBeDefined();
        expect(settings.provider).toEqual(0);
    });

    it("appPort()", async () => {
        const settings = service.appPort;
        expect(settings).toBeDefined();
        expect(settings).toEqual(3000);
    });

    it("db()", async () => {
        const settings = service.db;
        expect(settings).toBeDefined();
    });

    it("redis()", async () => {
        const settings = service.redis;
        expect(settings).toBeDefined();
    });

});
