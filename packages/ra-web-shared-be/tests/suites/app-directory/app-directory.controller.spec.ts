import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "@ra/web-auth-be/auth.service";
import { AuthMockService } from "../../mocks/auth-mock.service";
import { fastRandomFactory } from "@ra/web-core-be/src/core.provider";
import { LoggerMock } from "../../mocks/logger-mock";
import { Subscription } from "rxjs/internal/Subscription";
import { AppDirectoryController } from "../../../src/app-directory/app-directory.controller";
import { AppDirectoryService } from "../../../src/app-directory/app-directory.service";
import { AppDirectoryMockRepository } from "../../mocks/app-directory-mock.repository";
import { AppDirectoryIntentMockRepository } from "../../mocks/app-directory-intent-mock.repository";
import { AppDirectoryTypeMockRepository } from "../../mocks/app-directory-type-mock.repository";
import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { EnvironmentMockService } from "../../mocks/environment-mock.service";
import { JwtMockService } from "../../mocks/jwt-mock.service";
import { JwtService } from "@nestjs/jwt";

describe("AppDirectoryController", () => {
  let app: TestingModule;
  let service: AppDirectoryService;
  let controller: AppDirectoryController;
  const subscriptions: Subscription[] = [];

  beforeAll(async () => {
    app = await Test.createTestingModule({
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

  // @Inject("appDirectoryDao") private appDirectoryDao: AppDirectoryRepository,
  // @Inject("appDirectoryIntentDao") private appDirectoryIntentDao: AppDirectoryIntentRepository,
  // @Inject("appDirectoryTypeDao") private appDirectoryTypeDao: AppDirectoryTypeRepository,

  // @UseGuards(RolesGuard)
  // @Roles("ADMIN")
  // @Post()
  // public async createApp(@Bearer() token: string, @Body() app: AppDirectoryItemDto): Promise<AppDirectoryItemDto> {
  //     return this.appDirectoryService.createApp(token, app);
  // }

  // @UseGuards(RolesGuard)
  // @Roles("ADMIN")
  // @Post("/:appId/:type")
  // public async createManifest(token: string, @Body() manifest: any, @Param("appId") appId: string, @Param("type") type: string): Promise<any> {
  //     return this.appDirectoryService.createManifest(token, manifest, appId, type);
  // }

  // // @UseGuards(AuthGuard())
  // @Get("/:appId")
  // public async getAppDef(@Bearer() token: string, @Param("appId") appId: string): Promise<AppDirectoryItemDto> {
  //     return this.appDirectoryService.getAppDef(token, appId);
  // }

  // // @UseGuards(AuthGuard())
  // @Get("/search")
  // public async searchApps(@Bearer() token: string, @Query() query: any): Promise<AppDirectoryDto> {
  //     return this.appDirectoryService.searchApps(token, query);
  // }

  // // @UseGuards(AuthGuard())
  // @Get("/manifest/:appId")
  // public async getManifets(@Bearer() token: string, @Param("appId") appId: string): Promise<any> {
  //     return this.appDirectoryService.getManifest(token, appId);
  // }


  // describe("getLayout()", () => {
  //   it("should get Layout for user", async () => {
  //     const token = "AAAAA";
  //     const result = await controller.getLayout(token, "test");
  //     expect(result.result).toEqual("OK");
  //   });
  // });

  // describe("setLayout()", () => {
  //   it("should save layout", async () => {
  //     const token = "AAAAA";
  //     const result = await controller.setLayout(token, { body: "myStorage" }, "test");
  //     expect(result.result).toEqual("OK");
  //   });
  // });

  // describe("deleteLayout()", () => {
  //   it("should delete layout", async () => {
  //     const token = "AAAAA";
  //     const result = await controller.deleteLayout(token, "test");
  //     expect((result as any).result).toEqual("OK");
  //   });
  // });

  // describe("getLayoutsName()", () => {
  //   it("should show all saved layouts", async () => {
  //     const token = "AAAAA";
  //     const result = await controller.getLayoutsName(token);
  //     expect((result as any)[0].result).toEqual("OK");
  //   });
  // });

  // describe("getLayoutDefault(:modul)", () => {
  //   it("should return default layout name", async () => {
  //     const token = "AAAAA";
  //     const result = await controller.getLayoutDefault(token, "ADMIN");
  //     const json = JSON.parse(result.value);
  //     expect(json.result).toEqual("OK");
  //   });
  // });

  // describe("setLayoutDefault(:modul)", () => {
  //   it("should save default layout name", async () => {
  //     const token = "AAAAA";
  //     const result = await controller.setLayoutDefault(token, { body: "myLayout" }, "ADMIN");
  //     const json = JSON.parse(result.value);
  //     expect(json.result).toEqual("OK");
  //   });
  // });

});
