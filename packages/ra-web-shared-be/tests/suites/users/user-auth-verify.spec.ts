import { Test, TestingModule } from "@nestjs/testing";
import { LoggerMock } from "../../mocks/logger-mock";
import { Subscription } from "rxjs/internal/Subscription";
import { UserAuthVerify } from "../../../src/users/user-auth-verify";
import { UsersMockRepository } from "../../mocks/users-mock.repository";

describe("UserAuthVerify", () => {
  let app: TestingModule;
  let service: UserAuthVerify;
  const subscriptions: Subscription[] = [];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        UserAuthVerify,
        {
          provide: "userRepository",
          useClass: UsersMockRepository,
        },
        {
          provide: "logger",
          useClass: LoggerMock,
        },
      ],
    }).compile();
    service = app.get<UserAuthVerify>(UserAuthVerify);
  });

  afterEach(() => {
    for (const sub of subscriptions) {
      sub.unsubscribe();
    }
  });

  describe("find()", () => {
    it("should find user and check password", async () => {
      const result = await service.find({ email: "test@test.cz", password: "test" });
      expect(result).toBeDefined();
      expect(result.email).toEqual("test@test.cz");
    });
  });

});
