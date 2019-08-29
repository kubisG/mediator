import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { AuthMockService } from "../../mocks/auth-mock.service";
import { fastRandomFactory } from "@ra/web-core-be/dist/core.provider";
import { LoggerMock } from "../../mocks/logger-mock";
import { Subscription } from "rxjs/internal/Subscription";
import { ObjectRightsController } from "../../../src/object-rights/object-rights.controller";
import { ObjectRightsService } from "../../../src/object-rights/object-rights.service";
import { ObjectRightsMockRepository } from "../../mocks/object-rights-mock.repository";
import { UsersMockRepository } from "../../mocks/users-mock.repository";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { EnvironmentMockService } from "../../mocks/environment-mock.service";
import { JwtMockService } from "../../mocks/jwt-mock.service";
import { JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

describe("ObjectRightsController", () => {
  let app: TestingModule;
  let service: ObjectRightsService;
  let controller: ObjectRightsController;
  let subscriptions: Subscription[] = [];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: "jwt" })],
      controllers: [ObjectRightsController],
      providers: [
        fastRandomFactory,
        ObjectRightsService,
        {
          provide: "objectRightsRepository",
          useClass: ObjectRightsMockRepository,
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
        },
      ],
    }).compile();
    controller = app.get(ObjectRightsController);
    service = app.get(ObjectRightsService);
  });

  afterEach(() => {
    for (const sub of subscriptions) {
      sub.unsubscribe();
    }
  });


  describe("findAll()", () => {
    it("should find all result", async () => {
      const token = "AAAAA";
      const result = await controller.findAll(token);
      expect(result[0].result).toEqual("OK");
    });
  });

  describe("saveRight()", () => {
    it("should create right", async () => {
      const token = "AAAAA";
      const result = await controller.saveRight(token, { pref: { dataType: "OK", name: "Test", companyId: 1 } });
      expect(result.result).toEqual("OK");
    });
  });

  describe("deleteRight()", () => {
    it("should delete right", async () => {
      const token = "AAAAA";
      const result = await controller.deleteRight("test", 1, 1);

      expect((result as any).result).toEqual("OK");
    });
  });

  describe("getObjectRight()", () => {
    it("should find right for name", async () => {
      const token = "AAAAA";
      const result = await controller.getObjectRight(token, "test");

      expect((result as any).result).toEqual("OK");
    });
  });

  describe("findUseRights()", () => {
    it("should find all users rights", async () => {
      const token = "AAAAA";
      const result = await controller.findUseRights(token);
      expect((result[0] as any).result).toEqual("OK");
    });
  });

});
