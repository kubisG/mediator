import { Test, TestingModule } from "@nestjs/testing";
import { LoggerMock } from "../../mocks/logger-mock";
import { Subscription } from "rxjs/internal/Subscription";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { EnvironmentMockService } from "../../mocks/environment-mock.service";
import { UserSessionData } from "../../../src/users/user-session-data";
import { ObjectRightsMockRepository } from "../../mocks/object-rights-mock.repository";

describe("UserSessionData", () => {
  let app: TestingModule;
  let service: UserSessionData;
  const subscriptions: Subscription[] = [];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        UserSessionData,
        {
          provide: EnvironmentService,
          useClass: EnvironmentMockService,
        },
        {
          provide: "logger",
          useClass: LoggerMock,
        },
        {
          provide: "objectRightsRepository",
          useClass: ObjectRightsMockRepository,
        },
      ],
    }).compile();
    service = app.get<UserSessionData>(UserSessionData);
  });

  afterEach(() => {
    for (const sub of subscriptions) {
      sub.unsubscribe();
    }
  });

  describe("getData()", () => {
    it("should getData", async () => {
      const token = "AAAAA";
      const result = await service.getSessionData({
        id: 1, company: { id: 1 },
        username: "TEST", class: "USER"} as any, { email: "mail", sid: "sid", iat: 1, exp: 1 }, token);
      expect(result).toBeDefined();
      expect(result.email).toEqual("mail");
    });
  });

  describe("getResponseData()", () => {
    it("should getResponseData", async () => {
      const token = "AAAAA";
      const result = await service.getResponseData({
        id: 1, company: { id: 1 },
        username: "TEST", class: "USER"} as any, { email: "mail", sid: "sid", iat: 1, exp: 1 }, token);
      expect(result).toBeDefined();
      expect(result.payload.nickName).toEqual("TEST");
    });
  });

});
