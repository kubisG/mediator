import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "../../src/app.controller";
import { AppService } from "../../src/app.service";
import { HttpStatus } from "@nestjs/common";
import { TokenAuthGuard } from "@ra/web-auth-be/dist/guards/token-auth.guard";

import * as request from "supertest";
import * as pjson from "../../package.json";

// mock services
jest.mock("../../src/app.service");
// mock guard
// if guard is set on particular method or controller mock canActive function has no effect so
// it's better use original implementation and mock layer behind (e.g. service)
jest.mock("@ra/web-auth-be/dist/guards/token-auth.guard");

describe("AppController", () => {
  let app: any;
  let requester: request.SuperTest<request.Test>;
  let appService: AppService;
  let guard: TokenAuthGuard;

  // mock functions
  let getInfoFn;
  let canActivateFn;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        TokenAuthGuard,
      ],
    }).compile();

    appService = moduleFixture.get<AppService>(AppService);
    guard = moduleFixture.get<TokenAuthGuard>(TokenAuthGuard);
    app = moduleFixture.createNestApplication();
    // set up guard
    // set up canActive function and then set up guard itself
    canActivateFn = jest.spyOn(guard, "canActivate").mockResolvedValue(true);
    app.useGlobalGuards(guard); // useGlobalGuards has to be placed before init
    // set up requester
    requester = request(app.getHttpServer());
    // run app to be able call endpoints
    await app.init();
  });

  it("should return application info without any authorization", async (done) => {
    // prepare
    const url = "/";
    const expectedInfo = { version: pjson.version, name: pjson.name };
    // prepare functions
    getInfoFn = jest.spyOn(appService, "getInfo").mockReturnValue(expectedInfo);

    // execute
    const response = await requester.get(url);

    // verify method calls
    expect(getInfoFn).toHaveBeenCalledTimes(1);
    expect(canActivateFn).toHaveBeenCalledTimes(1);
    // verify result
    expect(response.status).toBe(HttpStatus.OK); // always use HttpStatus over number value
    expect(response.body).toMatchObject(expectedInfo); // user toMatchObject over toBe (serialization)

    // call done when finish
    done();
  });

  afterEach(() => {
    // needs to be called after each test, otherwise it's accumulate calls from previous tests
    getInfoFn.mockReset();
  });
});
