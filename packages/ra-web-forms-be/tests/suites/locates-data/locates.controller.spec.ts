import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { AuthMockService } from "../../mocks/auth-mock.service";
import { fastRandomFactory } from "@ra/web-core-be/dist/core.provider";
import { LoggerMock } from "../../mocks/logger-mock";
import { Subscription } from "rxjs/internal/Subscription";
import { LocatesDataController } from "../../../src/locates-data/locates-data.controller";
import { SystemChannelService } from "../../../src/system-channel/system-channel.service";
import { LocatesDataMockRepository } from "../../mocks/locates-data-mock.repository";
import { LocatesService } from "../../../src/locates-data/locates-data.service";
import { DataService } from "../../../src/locates-data/data.service";
import { AuditTrailMockRepository } from "../../mocks/audit-trail-mock.repository";
import { ExchangeDataMockRepository } from "../../mocks/exchange-data-mock.repository";


describe("LocatesDataController", () => {
  let app: TestingModule;
  let controller: LocatesDataController;
  const subscriptions: Subscription[] = [];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [LocatesDataController],
      providers: [
        fastRandomFactory,
        DataService,
        LocatesService,
        SystemChannelService,
        {
          provide: "auditTrailRepository",
          useClass: AuditTrailMockRepository,
        },
        {
          provide: "locatesDataRepository",
          useClass: LocatesDataMockRepository,
        },
        {
          provide: "exchangeDataRepository",
          useClass: ExchangeDataMockRepository,
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
    controller = app.get(LocatesDataController);
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
      const result = await controller.insert(token, {
        reqType: "AAA", symbol: "MSFT", user: 1, quantity: 200, broker: "BBB"
        , name: "Test", companyId: 1,
      });
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
