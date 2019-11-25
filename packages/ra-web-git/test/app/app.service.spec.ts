import { Test, TestingModule } from "@nestjs/testing";
import { AppService } from "../../src/app.service";

import * as _fs from "fs";
import * as pjson from "../../package.json";

describe("AppService", () => {
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  it("should return application info", async () => {
    // prepare input and results
    const expectedInfo = { version: pjson.version, name: pjson.name };

    // execute
    const result = await appService.getInfo();

    // verify result
    expect(result).toMatchObject(expectedInfo);
  });
});
