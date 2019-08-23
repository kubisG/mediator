import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { AuthMockService } from "../../mocks/auth-mock.service";
import { fastRandomFactory } from "@ra/web-core-be/dist/core.provider";
import { LoggerMock } from "../../mocks/logger-mock";
import { Subscription } from "rxjs/internal/Subscription";
import { LayoutController } from "../../../src/layout/layout.controller";
import { LayoutService } from "../../../src/layout/layout.service";
import { PreferencesMockRepository } from "../../mocks/preferences-mock.repository";
import { UsersMockRepository } from "../../mocks/users-mock.repository";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { EnvironmentMockService } from "../../mocks/environment-mock.service";
import { JwtMockService } from "../../mocks/jwt-mock.service";
import { JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

describe("LayoutController", () => {
  let app: TestingModule;
  let service: LayoutService;
  let controller: LayoutController;
  const subscriptions: Subscription[] = [];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [       PassportModule.register({ defaultStrategy: "jwt" }) ],
      controllers: [LayoutController],
      providers: [
        fastRandomFactory,
        LayoutService,
        {
          provide: "preferenceRepository",
          useClass: PreferencesMockRepository,
        },
        {
          provide: "userRepository",
          useClass: UsersMockRepository,
        },
        {
          provide: AuthService,
          useClass: AuthMockService,
        },
        {
          provide: EnvironmentService,
          useClass: EnvironmentMockService,
        },
        {
          provide: JwtService,
          useClass: JwtMockService,
        },
        {
          provide: "logger",
          useClass: LoggerMock,
        }
      ],
    }).compile();
    controller = app.get(LayoutController);
    service = app.get(LayoutService);
  });

  afterEach(() => {
    for (const sub of subscriptions) {
      sub.unsubscribe();
    }
  });



  describe("getLayout()", () => {
    it("should get Layout for user", async () => {
      const token = "AAAAA";
      const result = await controller.getLayout(token, "test");
      expect(result.result).toEqual("OK");
    });
  });

  describe("setLayout()", () => {
    it("should save layout", async () => {
      const token = "AAAAA";
      const result = await controller.setLayout(token, { body: "myStorage" }, "test");
      expect(result.result).toEqual("OK");
    });
  });

  describe("deleteLayout()", () => {
    it("should delete layout", async () => {
      const token = "AAAAA";
      const result = await controller.deleteLayout(token, "test");
      expect((result as any).result).toEqual("OK");
    });
  });

  describe("getLayoutsName()", () => {
    it("should show all saved layouts", async () => {
      const token = "AAAAA";
      const result = await controller.getLayoutsName(token);
      expect((result as any)[0].result).toEqual("OK");
    });
  });

  describe("getLayoutDefault(:modul)", () => {
    it("should return default layout name", async () => {
      const token = "AAAAA";
      const result = await controller.getLayoutDefault(token, "ADMIN");
      const json = JSON.parse(result.value);
      expect(json.result).toEqual("OK");
    });
  });

  describe("setLayoutDefault(:modul)", () => {
    it("should save default layout name", async () => {
      const token = "AAAAA";
      const result = await controller.setLayoutDefault(token, { body: "myLayout" }, "ADMIN");
      const json = JSON.parse(result.value);
      expect(json.result).toEqual("OK");
    });
  });

  describe("setPublicPrivate(:state)", () => {
    it("should cahnge public/private property", async () => {
      const token = "AAAAA";
      const result = await controller.setPublicPrivate(token, { name: "test" }, "Public");
      expect(result.result).toEqual("OK");
    });
  });

});
