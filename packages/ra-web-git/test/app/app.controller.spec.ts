import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "../../src/app.controller";
import { AppService } from "../../src/app.service";
import * as pjson from "../../package.json";

describe("AppController", () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  it("should return application info", () => {
    // prepare
    const expectedInfo = { version: pjson.version, name: pjson.name };
    jest.spyOn(appService, "getInfo").mockImplementation(() => expectedInfo);

    // execute
    const info = appController.getInfo();

    // verify
    expect(info).toMatchObject(expectedInfo);
  });
});
