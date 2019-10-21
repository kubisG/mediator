import { Test, TestingModule } from "@nestjs/testing";
import { FormsSpecService } from "../../../src/forms-spec/forms-spec.service";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { AuthMockService } from "../../mocks/auth-mock.service";
import { fastRandomFactory } from "@ra/web-core-be/dist/core.provider";
import { LoggerMock } from "../../mocks/logger-mock";
import { Subscription } from "rxjs/internal/Subscription";
import { FormsSpecController } from "../../../src/forms-spec/forms-spec.controller";
import { SystemChannelService } from "../../../src/system-channel/system-channel.service";
import { FormsSpecMockRepository } from "../../mocks/forms-spec-mock.repository";

describe("FormsSpecController", () => {
    let app: TestingModule;
    let formsSpecService: FormsSpecService;
    let controller: FormsSpecController;
    let systemChannelService: SystemChannelService;
    const subscriptions: Subscription[] = [];

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [FormsSpecController],
            providers: [
                fastRandomFactory,
                FormsSpecService,
                SystemChannelService,
                {
                    provide: "formsSpecRepository",
                    useClass: FormsSpecMockRepository,
                },
                {
                    provide: AuthService,
                    useClass: AuthMockService,
                },
                {
                    provide: "logger",
                    useClass: LoggerMock,
                }
            ],
        }).compile();
        controller = app.get(FormsSpecController);
        formsSpecService = app.get(FormsSpecService);
        systemChannelService = app.get(SystemChannelService);
    });

    afterEach(() => {
        for (const sub of subscriptions) {
            sub.unsubscribe();
        }
    });

    describe("getMany()", () => {
        it("should getMany all specs", async () => {
            const token = "AAAAA";
            const result = await controller.getMany(token);
            expect(result[0].result).toEqual("OK");
        });
    });


    describe("findOne()", () => {
        it("should find one result", async () => {
            const token = "AAAAA";
            const result = await controller.findOne(token, "id");
            expect(result.result).toEqual("OK");
        });
    });


    describe("insert()", () => {
        it("should insert record", async () => {
            const token = "AAAAA";
            const result = await controller.insert(token, { dataType: "OK", name: "Test", companyId: 1 });
            expect(result.result).toEqual("OK");
        });
    });

    describe("deleteOne()", () => {
        it("should deleteOne record", async () => {
            const token = "AAAAA";
            const result = await controller.deleteOne(token, 1);
            expect(result.result).toEqual("OK");
        });
    });

});
