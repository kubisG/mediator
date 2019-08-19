import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { AuthMockService } from "../../mocks/auth-mock.service";
import { fastRandomFactory } from "@ra/web-core-be/dist/core.provider";
import { LoggerMock } from "../../mocks/logger-mock";
import { Subscription } from "rxjs/internal/Subscription";
import { UsersController } from "../../../src/users/users.controller";
import { UsersService } from "../../../src/users/users.service";
import { UsersMockRepository } from "../../mocks/users-mock.repository";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { EnvironmentMockService } from "../../mocks/environment-mock.service";
import { JwtMockService } from "../../mocks/jwt-mock.service";
import { JwtService } from "@nestjs/jwt";
import { MailerMock } from "../../mocks/mailer-mock";
import { PreferencesMockRepository } from "../../mocks/preferences-mock.repository";
import { PassportModule } from "@nestjs/passport";

describe("UsersController", () => {
  let app: TestingModule;
  let service: UsersService;
  let controller: UsersController;
  let subscriptions: Subscription[] = [];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: "jwt" })],
      controllers: [UsersController],
      providers: [
        fastRandomFactory,
        UsersService,
        {
          provide: "userRepository",
          useClass: UsersMockRepository,
        },
        {
          provide: "preferenceRepository",
          useClass: PreferencesMockRepository,
        },
        {
          provide: "mailer",
          useClass: MailerMock,
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
    controller = app.get(UsersController);
    service = app.get(UsersService);
  });

  afterEach(() => {
    for (const sub of subscriptions) {
      sub.unsubscribe();
    }
  });

  describe('createUser()', () => {
    it('should ucreate new user record', async () => {
      const token = "AAAAA";
      const result = await controller.createUser(token, {
        id: 1, userName: "name", password: "pasword", class: "ADMIN",
        company: { id: 1 }
      });
      expect((result as any).result).toEqual("OK");
    });
  });

  describe('findOne()', () => {
    it('should find one result', async () => {
      const token = "AAAAA";
      const result = await controller.findOne(1);
      expect((result as any).result).toEqual("OK");
    });
  });

  describe('findAll()', () => {
    it('should find all result', async () => {
      const token = "AAAAA";
      const result = await controller.findAll(token);
      expect((result[0] as any)[0].result).toEqual("OK");
    });
  });

  describe('findCompAll()', () => {
    it('should find all form company result', async () => {
      const token = "AAAAA";
      const result = await controller.findCompAll(token);
      expect((result[0] as any).result).toEqual("OK");
    });
  });

  describe('getUsersLayoutPreferences()', () => {
    it('should preferences for user', async () => {
      const token = "AAAAA";
      const result = await controller.getUsersLayoutPreferences();
      expect((result["1-1"] as any).result).toEqual("OK");
    });
  });


  describe('setLogging()', () => {
    it('should set Logging for user', async () => {
      const token = "AAAAA";
      const result = await controller.setLogging(1, 1, "true");
      const json = JSON.parse((result as any).value);
      expect(json.result).toEqual("OK");
    });
  });

  describe('updateUser()', () => {
    it('should updateUser record', async () => {
      const token = "AAAAA";
      const result = await controller.updateUser(token, 1, {
        id: 1, userName: "name", password: "pasword", class: "ADMIN", company: 1
      });
      expect((result as any).result).toEqual("OK");
    });
  });

  describe('remove()', () => {
    it('should remove record', async () => {
      const token = "AAAAA";
      const result = await controller.remove(1);

      expect(result.result).toEqual("OK");
    });
  });

  describe("service.getLayoutsName()", () => {
    it("should show all saved layouts", async () => {
      const token = "AAAAA";
      const result = await service.getLayoutsName(token);
      expect((result as any)[0].result).toEqual("OK");
    });
  });

});
