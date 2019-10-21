import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { AuthMockService } from "../../mocks/auth-mock.service";
import { fastRandomFactory } from "@ra/web-core-be/dist/core.provider";
import { LoggerMock } from "../../mocks/logger-mock";
import { Subscription } from "rxjs/internal/Subscription";
import { FormsController } from "../../../src/forms-data/forms.controller";
import { SystemChannelService } from "../../../src/system-channel/system-channel.service";
import { FormsSpecMockRepository } from "../../mocks/forms-spec-mock.repository";
import { FormsDataMockRepository } from "../../mocks/forms-data-mock.repository";
import { FormsService } from "../../../src/forms-data/forms.service";
import { AuditTrailMockRepository } from "../../mocks/audit-trail-mock.repository";
import { RulesDataMockRepository } from "../../mocks/rules-data-mock.repository";
import { ExchangeDataMockRepository } from "../../mocks/exchange-data-mock.repository";

describe("FormsDataController", () => {
  let app: TestingModule;
  let controller: FormsController;
  let subscriptions: Subscription[] = [];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [FormsController],
      providers: [
        fastRandomFactory,
        FormsService,
        SystemChannelService,
        {
          provide: "formsSpecRepository",
          useClass: FormsSpecMockRepository,
        },
        {
          provide: "rulesDataRepository",
          useClass: RulesDataMockRepository,
        },
        {
          provide: "auditTrailRepository",
          useClass: AuditTrailMockRepository,
        },
        {
          provide: "exchangeDataRepository",
          useClass: ExchangeDataMockRepository,
        },
        {
          provide: "formsDataRepository",
          useClass: FormsDataMockRepository,
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
    controller = app.get(FormsController);
  });

  afterEach(() => {
    for (const sub of subscriptions) {
      sub.unsubscribe();
    }
  });

  describe("getMany()", () => {
    it("should getMany all specs", async () => {
      const token = "AAAAA";
      const result = await controller.getMany("TYP", "2011-01-01~2015-01-01", token);
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
      expect(result[0].result).toEqual("OK");
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
