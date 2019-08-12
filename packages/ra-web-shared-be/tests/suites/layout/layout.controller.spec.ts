import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "@ra/web-auth-be/auth.service";
import { AuthMockService } from "../../mocks/auth-mock.service";
import { fastRandomFactory } from "@ra/web-core-be/core.provider";
import { LoggerMock } from "../../mocks/logger-mock";
import { Subscription } from "rxjs/internal/Subscription";
import { LayoutController } from "../../../src/layout/layout.controller";
import { LayoutService } from "../../../src/layout/layout.service";
import { PreferencesMockRepository } from "../../mocks/preferences-mock.repository";
import { UsersMockRepository } from "../../mocks/users-mock.repository";
import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { EnvironmentMockService } from "../../mocks/environment-mock.service";
import { JwtMockService } from "../../mocks/jwt-mock.service";
import { JwtService } from "@nestjs/jwt";


describe("LayoutController", () => {
  let app: TestingModule;
  let service: LayoutService;
  let controller: LayoutController;
  let subscriptions: Subscription[] = [];

  beforeAll(async () => {
      app = await Test.createTestingModule({
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



    describe('getLayout()', () => {
      it('should get Layout for user', async () => {
          const token = "AAAAA";
        const result = await controller.getLayout(token, "test");

        console.log("getLayout,", result);
        const json = JSON.parse(result);
        expect(json.result).toEqual("OK");
      });
    });

    describe('setLayout()', () => {
        it('should dave layout', async () => {
            const token = "AAAAA";
          const result = await controller.setLayout(token, {body: "myStorage"}, "test");
          console.log("setLayout,", result);
          const json = JSON.parse((result as any ).value);
          expect(json.result).toEqual("OK");          
        });
      });


});
