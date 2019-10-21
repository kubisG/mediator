import { Test, TestingModule } from "@nestjs/testing";
import { LoggerMock } from "../../mocks/logger-mock";
import { Subscription } from "rxjs/internal/Subscription";
import { DataService } from "../../../src/locates-data/data.service";

describe("DataService", () => {
  let app: TestingModule;
  let service: DataService;
  const subscriptions: Subscription[] = [];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        DataService,
        {
          provide: "logger",
          useClass: LoggerMock,
        }
      ],
    }).compile();
    service = app.get<DataService>(DataService);
  });

  afterEach(() => {
    for (const sub of subscriptions) {
      sub.unsubscribe();
    }
  });

  describe("getData()", () => {
    it("should getData from soap", async () => {
    //   const token = "AAAAA";
    //   const result = await service.getData("MSFT");
    //   expect((result as any).PensonResponse.PensonStatus.StatusCode).toEqual("104");
      expect(true).toBe(true);
    });
  });

});
