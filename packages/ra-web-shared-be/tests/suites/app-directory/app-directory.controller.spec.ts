import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { AuthMockService } from "../../mocks/auth-mock.service";
import { fastRandomFactory } from "@ra/web-core-be/dist/core.provider";
import { LoggerMock } from "../../mocks/logger-mock";
import { Subscription } from "rxjs/internal/Subscription";
import { AppDirectoryController } from "../../../src/app-directory/app-directory.controller";
import { AppDirectoryService } from "../../../src/app-directory/app-directory.service";
import { AppDirectoryMockRepository } from "../../mocks/app-directory-mock.repository";
import { AppDirectoryIntentMockRepository } from "../../mocks/app-directory-intent-mock.repository";
import { AppDirectoryTypeMockRepository } from "../../mocks/app-directory-type-mock.repository";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { EnvironmentMockService } from "../../mocks/environment-mock.service";
import { JwtMockService } from "../../mocks/jwt-mock.service";
import { JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

describe("AppDirectoryController", () => {
  let app: TestingModule;
  let service: AppDirectoryService;
  let controller: AppDirectoryController;
  const subscriptions: Subscription[] = [];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [       PassportModule.register({ defaultStrategy: "jwt" }) ],
      controllers: [AppDirectoryController],
      providers: [
        fastRandomFactory,
        AppDirectoryService,
        {
          provide: "appDirectoryDao",
          useClass: AppDirectoryMockRepository,
        },
        {
          provide: "appDirectoryIntentDao",
          useClass: AppDirectoryIntentMockRepository,
        },
        {
          provide: "appDirectoryTypeDao",
          useClass: AppDirectoryTypeMockRepository,
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
    controller = app.get(AppDirectoryController);
    service = app.get(AppDirectoryService);
  });

  afterEach(() => {
    for (const sub of subscriptions) {
      sub.unsubscribe();
    }
  });


  describe("createApp()", () => {
    it("should create directory app", async () => {
      const token = "AAAAA";

      const result = await controller.createApp(token, AppDirectoryMockRepository.appDirectoryItem);
      expect((result as any).name).toEqual("Test");
      expect((result as any).manifest).toEqual("Test");
      expect((result as any).manifest).toEqual("Test");
    });
  });

  describe("getAppDef()", () => {
    it("should create directory app", async () => {
      const token = "AAAAA";
      const result = await controller.getAppDef(token, "Test");
      expect((result as any).name).toEqual("Test");
      expect((result as any).manifest).toEqual("Test");
      expect((result as any).manifestType).toEqual("Test");
    });
  });

  describe("searchApps()", () => {
    it("should create directory app", async () => {
      const token = "AAAAA";

      const result = await controller.searchApps(token, "Test");
      expect(result.applications[0].name).toEqual("Test");
      expect(result.applications[0].manifest).toEqual("Test");
      expect(result.applications[0].manifestType).toEqual("Test");
    });
  });

});
