import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "@ra/web-auth-be/auth.service";
import { AuthMockService } from "../../mocks/auth-mock.service";
import { fastRandomFactory } from "@ra/web-core-be/core.provider";
import { LoggerMock } from "../../mocks/logger-mock";
import { Subscription } from "rxjs/internal/Subscription";
import { PreferencesController } from "../../../src/preferences/preferences.controller";
import { PreferencesService } from "../../../src/preferences/preferences.service";
import { PreferencesMockRepository } from "../../mocks/preferences-mock.repository";
import { UsersMockRepository } from "../../mocks/users-mock.repository";
import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { EnvironmentMockService } from "../../mocks/environment-mock.service";
import { JwtMockService } from "../../mocks/jwt-mock.service";
import { JwtService } from "@nestjs/jwt";


describe("PreferencesController", () => {
  let app: TestingModule;
  let service: PreferencesService;
  let controller: PreferencesController;
  let subscriptions: Subscription[] = [];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PreferencesController],
      providers: [
        fastRandomFactory,
        PreferencesService,
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
    controller = app.get(PreferencesController);
    service = app.get(PreferencesService);
  });

  afterEach(() => {
    for (const sub of subscriptions) {
      sub.unsubscribe();
    }
  });



  describe("getStorage()", () => {
    it("should getStorage get storage", async () => {
      const token = "AAAAA";
      const result = await controller.getStorage(token, "test");
      const json = JSON.parse(result);
      expect(json.result).toEqual("OK");
    });
  });

  describe("setStorage()", () => {
    it("should setStorage save storage", async () => {
      const token = "AAAAA";
      const result = await controller.setStorage(token, "test", { body: "myStorage" });
      const json = JSON.parse((result as any).value);
      expect(json.result).toEqual("OK");
    });
  });


  describe("findAll()", () => {
    it("should find all result", async () => {
      const token = "AAAAA";
      const result = await controller.findAll(token);
      expect(result.pref.result).toEqual("OK");
    });
  });


  describe("create()", () => {
    it("should create record", async () => {
      const token = "AAAAA";
      const result = await controller.create(token, { pref: { dataType: "OK", name: "Test", companyId: 1 } });
      const json = JSON.parse(result.value);
      expect(json.result).toEqual("OK");
    });
  });

  describe("update()", () => {
    it("should update record", async () => {
      const token = "AAAAA";
      const result = await controller.update(token, { pref: { dataType: "OK", name: "Test", companyId: 1 } });
      const json = JSON.parse(result.value);
      expect(json.result).toEqual("OK");
    });
  });

  describe("savePreference()", () => {
    it("should save pref record", async () => {
      const token = "AAAAA";
      const result = await controller.savePreference({ value: "OK", name: "Test", companyId: 1 } );
      expect((result as any).result).toEqual("OK");
    });
  });

  describe("deletePreference()", () => {
    it("should delete pref record", async () => {
      const token = "AAAAA";
      const result = await controller.deletePreference("test", 1, 1 );
      expect((result as any).result).toEqual("OK");
    });
  });

  describe("findUserPref()", () => {
    it("should find pref result", async () => {
      const token = "AAAAA";
      const result = await controller.findUserPref(token, "test");
      const json = JSON.parse((result as any));
      expect(json.result).toEqual("OK");
    });
  });

  describe("setUserPref()", () => {
    it("should set pref result", async () => {
      const token = "AAAAA";
      const result = await controller.setUserPref(token, "test", { value: "OK", name: "Test", companyId: 1 });
      const json = JSON.parse((result as any).value);
      expect(json.result).toEqual("OK");
    });
  });

});
