import { Test, TestingModule } from "@nestjs/testing";
import { GitService } from "../../src/git/git.service";
import { ConfigService } from "../../src/config/config.service";
import { Logger, InternalServerErrorException } from "@nestjs/common";
import { CloneRequestDto } from "src/git/dto/clone-request.dto";

import * as simplegit from "simple-git/promise";
import * as utils from "../../src/utils";

// mock services
jest.mock("../../src/config/config.service");
// mock utils
jest.mock("../../src/utils");
// mock function
jest.mock("simple-git/promise");

describe("GitService", () => {
  let gitService: GitService;
  let configService: ConfigService;
  let logger: Logger;

  let logErrorFn = null;
  let createPathFn = null;
  let getDirectoryNameFn = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GitService,
        ConfigService,
        {
          provide: "logger",
          useClass: Logger,
        },
      ],
    }).compile();

    logger = module.get<Logger>("logger");
    gitService = module.get<GitService>(GitService);
    configService = module.get<ConfigService>(ConfigService);
    // mock function here for every test case
    Object.defineProperty(configService, "basePath", { configurable: true, get: jest.fn(() => "testBasePath") });
    logErrorFn = jest.spyOn(logger, "error").mockImplementation(() => {});
  });

  describe("Test clone method", () => {
    const userName = "testUserName";
    const repoKey = "testRepoKey";
    const repoPath = "testRepoPath/test.git";
    const gitUserName = "testGitUserName";
    const gitPassword = "testGitPassword";
    const cloneRequest = { userName: gitUserName, repoPath, password: gitPassword } as CloneRequestDto;
    let createGitFn = null;

    beforeEach(async () => {
      createPathFn = jest.spyOn(utils, "createPath").mockReturnValue(`${configService.basePath}/${userName}/${repoKey}`);
      getDirectoryNameFn = jest.spyOn(utils, "getDirectoryName").mockReturnValue("test");
    });

    it("should successfully call clone method", async () => {
      // prepare results
      const expectedResult = "success";
      // prepare functions
      createGitFn = (simplegit as jest.Mock).mockImplementation(() => ({ // returns object with function silent
        silent: jest.fn().mockImplementation(() => ({ // returns object with function clone
          clone: jest.fn().mockImplementation(() => "success"),
        })),
      }));

      // execute
      const result = await gitService.clone(userName, repoKey, cloneRequest);

      // verify results
      expect(result).toEqual(expectedResult);
      // verify function calls
      expect(createGitFn).toHaveBeenCalled();
      expect(createPathFn).toHaveBeenCalled();
      expect(getDirectoryNameFn).toHaveBeenCalled();
      expect(logErrorFn).not.toHaveBeenCalled();
    });

    it("should return error if git clone function fails", async () => {
      // prepare results
      let result = null;
      let errorResult = null;
      // prepare functions
      const expectedError = new InternalServerErrorException("Cloning repository failed.", "Clone method failed.");
      createGitFn = (simplegit as jest.Mock).mockImplementation(() => ({ // returns object with function silent
        silent: jest.fn().mockImplementation(() => ({ // returns object with function clone
          clone: jest.fn().mockRejectedValue(new Error("Clone method failed.")),
        })),
      }));

      // execute
      try {
        result = await gitService.clone(userName, repoKey, cloneRequest);
      } catch (error) {
        errorResult = error;
      }

      // verify result
      expect(result).toBeNull();
      expect(errorResult.message).toMatchObject(expectedError.message);
      // verify method calls
      expect(createGitFn).toHaveBeenCalled();
      expect(createPathFn).toHaveBeenCalled();
      expect(getDirectoryNameFn).toHaveBeenCalled();
      expect(logErrorFn).toHaveBeenCalled();
    });

  });
});
