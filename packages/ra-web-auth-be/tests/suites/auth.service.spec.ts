import { Test, TestingModule } from "@nestjs/testing";
import { LoggerMock } from "../mocks/logger-mock";
import { Subscription } from "rxjs/internal/Subscription";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { EnvironmentMockService } from "../mocks/environment-mock.service";
import { JwtService } from "@nestjs/jwt";
import { JwtMockService } from "../mocks/jwt-mock.service";
import { SessionsStoreMock } from "../mocks/sessios.store-mock.service.";
import { AuthService } from "../../src/auth.service";
import { VerifyService } from "../../src/verify/verify.service";
import { SessionDataService } from "../../src/session-data/session-data.service";

describe("AuthService", () => {
  let app: TestingModule;
  let service: AuthService;
  const subscriptions: Subscription[] = [];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        AuthService,
        VerifyService,
        SessionDataService,
        {
          provide: EnvironmentService,
          useClass: EnvironmentMockService,
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
            provide: "sessions",
            useClass: SessionsStoreMock,
        },
      ],
    }).compile();
    service = app.get<AuthService>(AuthService);
  });

  afterEach(() => {
    for (const sub of subscriptions) {
      sub.unsubscribe();
    }
  });

  describe("createToken()", () => {
    it("should createToken", async () => {
      const token = "AAAAA";
      const result = await service.createToken({ email: "test@test.cz", password: "test" });
      expect(result).toBeDefined();
      expect(result.email).toEqual("test@test.cz");
    });
  });


});
