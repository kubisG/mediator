import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "../../src/app.controller";
import { AppService } from "../../src/app.service";
import { HttpStatus } from "@nestjs/common";

import * as request from "supertest";
import * as pjson from "../../package.json";

// mock services
jest.mock("../../src/app.service");

describe("AppController", () => {
  let app: any;
  let requester: request.SuperTest<request.Test>;
  let appService: AppService;

  // mock functions
  let getInfoFn;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appService = moduleFixture.get<AppService>(AppService);
    app = moduleFixture.createNestApplication();
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
