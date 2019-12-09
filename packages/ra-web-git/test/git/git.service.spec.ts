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
  let createGitFn = null;

  const userName = "testUserName";
  const repoKey = "testRepoKey";
  const repoPath = "testRepoPath/test.git";
  const gitUserName = "testGitUserName";
  const gitPassword = "testGitPassword";

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
    logErrorFn = jest.spyOn(logger, "error").mockImplementation(() => { });
  });

  describe("Test clone method", () => {
    const cloneRequest = { userName: gitUserName, repoPath, password: gitPassword } as CloneRequestDto;
    const cloneUrl = "https://testGitUserName:testGitPassword@testRepoPath/test.git";
    let cloneToPath = null;

    beforeEach(async () => {
      cloneToPath = `${configService.basePath}/${userName}/${repoKey}`; // have to be here cause otherwise 'configService.basePath' is unedefined
      createPathFn = jest.spyOn(utils, "createPath").mockReturnValue(`${configService.basePath}/${userName}/${repoKey}`);
    });

    it("should successfully call clone method", async () => {
      // prepare results
      const expectedResult = "success";
      // prepare functions
      const cloneFn = jest.fn().mockImplementation(() => "success");
      createGitFn = (simplegit as jest.Mock).mockImplementation(() => ({ // returns object with function silent
        silent: jest.fn().mockImplementation(() => ({ // returns object with function clone
          clone: cloneFn,
        })),
      }));

      // execute
      const result = await gitService.clone(userName, repoKey, cloneRequest);

      // verify results
      expect(result).toEqual(expectedResult);
      // verify function calls
      expect(createGitFn).toHaveBeenCalled();
      expect(createPathFn).toHaveBeenCalledWith(configService.basePath, userName, repoKey);
      expect(cloneFn).toHaveBeenCalledWith(cloneUrl, cloneToPath);
      expect(logErrorFn).not.toHaveBeenCalled();
    });

    it("should return error if git clone function fails", async () => {
      // prepare results
      let result = null;
      let errorResult = null;
      // prepare functions
      const expectedError = new InternalServerErrorException("Cloning repository failed.", "Clone method failed.");
      const cloneFn = jest.fn().mockRejectedValue(new Error("Clone method failed."));
      createGitFn = (simplegit as jest.Mock).mockImplementation(() => ({ // returns object with function silent
        silent: jest.fn().mockImplementation(() => ({ // returns object with function clone
          clone: cloneFn,
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
      expect(createPathFn).toHaveBeenCalledWith(configService.basePath, userName, repoKey);
      expect(cloneFn).toHaveBeenCalledWith(cloneUrl, cloneToPath);
      expect(logErrorFn).toHaveBeenCalled();
    });
  });

  describe("Test pull method", () => {

    beforeEach(async () => {
      createPathFn = jest.spyOn(utils, "createPath").mockReturnValue(`${configService.basePath}/${userName}/${repoKey}`);
    });

    it("should successfully call pull method", async () => {
      // prepare results
      const expectedResult = { changes: 0, insertions: 0, deletions: 0 };
      // prepare functions
      const pullFn = jest.fn().mockImplementation(() => ({ summary: { changes: 0, insertions: 0, deletions: 0 } }));
      createGitFn = (simplegit as jest.Mock).mockImplementation(() => ({ // returns object with function silent
        silent: jest.fn().mockImplementation(() => ({ // returns object with function clone
          pull: pullFn,
        })),
      }));

      // execute
      const result = await gitService.pull(userName, repoKey);

      // verify results
      expect(result).toEqual(expectedResult);
      // verify function calls
      expect(createGitFn).toHaveBeenCalled();
      expect(createPathFn).toHaveBeenCalledWith(configService.basePath, userName, repoKey);
      expect(pullFn).toHaveBeenCalledWith();
      expect(logErrorFn).not.toHaveBeenCalled();
    });

    it("should return error if git pull function fails", async () => {
      // prepare results
      const expectedError = new InternalServerErrorException("Pulling changes failed.", "Pull method failed.");
      let result = null;
      let errorResult = null;
      // prepare functions
      const pullFn = jest.fn().mockRejectedValue(new Error("Pull method failed."));
      createGitFn = (simplegit as jest.Mock).mockImplementation(() => ({ // returns object with function silent
        silent: jest.fn().mockImplementation(() => ({ // returns object with function clone
          pull: pullFn,
        })),
      }));

      // execute
      try {
        result = await gitService.pull(userName, repoKey);
      } catch (error) {
        errorResult = error;
      }

      // verify result
      expect(result).toBeNull();
      expect(errorResult.message).toMatchObject(expectedError.message);
      // verify method calls
      expect(createGitFn).toHaveBeenCalled();
      expect(createPathFn).toHaveBeenCalledWith(configService.basePath, userName, repoKey);
      expect(pullFn).toHaveBeenCalledWith();
      expect(logErrorFn).toHaveBeenCalled();
    });
  });

  describe("Test checkout branch method", () => {
    const branch = "testBranchName";

    beforeEach(async () => {
      createPathFn = jest.spyOn(utils, "createPath").mockReturnValue(`${configService.basePath}/${userName}/${repoKey}`);
    });

    it("should successfully call pull method", async () => {
      // prepare functions
      const checkoutFn = jest.fn().mockImplementation(async () => {});
      createGitFn = (simplegit as jest.Mock).mockImplementation(() => ({ // returns object with function silent
        silent: jest.fn().mockImplementation(() => ({ // returns object with function clone
          checkout: checkoutFn,
        })),
      }));

      // execute
      const result = await gitService.checkout(userName, repoKey, branch);

      // verify results
      expect(result).toBeUndefined();
      // verify function calls
      expect(createGitFn).toHaveBeenCalled();
      expect(createPathFn).toHaveBeenCalledWith(configService.basePath, userName, repoKey);
      expect(checkoutFn).toHaveBeenCalledWith(branch);
      expect(logErrorFn).not.toHaveBeenCalled();
    });

    it("should return error if git pull function fails", async () => {
      // prepare results
      const expectedError = new InternalServerErrorException("Checkout branch failed.", "Checkout method failed.");
      let result = null;
      let errorResult = null;
      // prepare functions
      const checkoutFn = jest.fn().mockRejectedValue(new Error("Checkout method failed."));
      createGitFn = (simplegit as jest.Mock).mockImplementation(() => ({ // returns object with function silent
        silent: jest.fn().mockImplementation(() => ({ // returns object with function clone
          checkout: checkoutFn,
        })),
      }));

      // execute
      try {
        result = await gitService.checkout(userName, repoKey, branch);
      } catch (error) {
        errorResult = error;
      }

      // verify result
      expect(result).toBeNull();
      expect(errorResult.message).toMatchObject(expectedError.message);
      // verify method calls
      expect(createGitFn).toHaveBeenCalled();
      expect(createPathFn).toHaveBeenCalledWith(configService.basePath, userName, repoKey);
      expect(checkoutFn).toHaveBeenCalledWith(branch);
      expect(logErrorFn).toHaveBeenCalled();
    });
  });

  describe("Test commit local changes method", () => {
    const message = "Test commit message";
    const not_added = ["notAddedFile1.txt", "notAddedFile2.txt"]; // newly created
    const deleted = ["deletedFile1.txt", "deletedFile2.txt"];
    const modified = ["modiefiedFile1.txt", "modifiedFile2.txt"];
    const summary = { not_added, deleted, modified };

    beforeEach(async () => {
      createPathFn = jest.spyOn(utils, "createPath").mockReturnValue(`${configService.basePath}/${userName}/${repoKey}`);
    });

    it("should commit local changes", async () => {
      // prepare functions
      const statusFn = jest.fn().mockResolvedValue(summary);
      const addFn = jest.fn().mockImplementation(async () => {});
      const commitFn = jest.fn().mockImplementation(async () => {});
      createGitFn = (simplegit as jest.Mock).mockImplementation(() => ({ // returns object with function silent
        silent: jest.fn().mockImplementation(() => ({ // returns object with function clone
          status: statusFn,
          add: addFn,
          commit: commitFn,
        })),
      }));

      // execute
      const result = await gitService.commit(userName, repoKey, message);

      // verify results
      expect(result).toBeUndefined();
      // verify function calls
      expect(createGitFn).toHaveBeenCalled();
      expect(createPathFn).toHaveBeenCalledWith(configService.basePath, userName, repoKey);
      expect(statusFn).toHaveBeenCalledWith();
      expect(addFn).toHaveBeenCalledWith([...summary.not_added, ...summary.deleted, ...summary.modified]);
      expect(commitFn).toHaveBeenCalledWith(message);
      expect(logErrorFn).not.toHaveBeenCalled();
    });

    it("should return error if commit local changes failed", async () => {
      // prepare results
      const expectedError = new InternalServerErrorException("Commit changes failed.", "Commit local changes method failed.");
      let result = null;
      let errorResult = null;
      // prepare functions
      const statusFn = jest.fn().mockResolvedValue(summary);
      const addFn = jest.fn().mockImplementation(async () => {});
      const commitFn = jest.fn().mockRejectedValue(new Error("Commit local changes method failed."));
      createGitFn = (simplegit as jest.Mock).mockImplementation(() => ({ // returns object with function silent
        silent: jest.fn().mockImplementation(() => ({ // returns object with function clone
          status: statusFn,
          add: addFn,
          commit: commitFn,
        })),
      }));

      // execute
      try {
        result = await gitService.commit(userName, repoKey, message);
      } catch (error) {
        errorResult = error;
      }

      // verify result
      expect(result).toBeNull();
      expect(errorResult.message).toMatchObject(expectedError.message);
      // verify method calls
      expect(createGitFn).toHaveBeenCalled();
      expect(createPathFn).toHaveBeenCalledWith(configService.basePath, userName, repoKey);
      expect(statusFn).toHaveBeenCalledWith();
      expect(addFn).toHaveBeenCalledWith([...summary.not_added, ...summary.deleted, ...summary.modified]);
      expect(commitFn).toHaveBeenCalledWith(message);
      expect(logErrorFn).toHaveBeenCalled();
    });
  });

  describe("Test get status method", () => {
    const not_added = ["notAddedFile1.txt", "notAddedFile2.txt"]; // newly created
    const deleted = ["deletedFile1.txt", "deletedFile2.txt"];
    const modified = ["modiefiedFile1.txt", "modifiedFile2.txt"];
    const summary = { not_added, deleted, modified };

    beforeEach(async () => {
      createPathFn = jest.spyOn(utils, "createPath").mockReturnValue(`${configService.basePath}/${userName}/${repoKey}`);
    });

    it("should commit local changes", async () => {
      // prepare result
      const expectResult =  { unstaged: not_added, deleted, modified, conflicted: undefined };
      // prepare functions
      const statusFn = jest.fn().mockResolvedValue(summary);
      createGitFn = (simplegit as jest.Mock).mockImplementation(() => ({ // returns object with function silent
        silent: jest.fn().mockImplementation(() => ({ // returns object with function clone
          status: statusFn,
        })),
      }));

      // execute
      const result = await gitService.getStatus(userName, repoKey);

      // verify results
      expect(result).toEqual(expectResult);
      // verify function calls
      expect(createGitFn).toHaveBeenCalled();
      expect(createPathFn).toHaveBeenCalledWith(configService.basePath, userName, repoKey);
      expect(statusFn).toHaveBeenCalledWith();
      expect(logErrorFn).not.toHaveBeenCalled();
    });

    it("should return error if get repo status failed", async () => {
      // prepare results
      const expectedError = new InternalServerErrorException("Get repository status failed.", "Get repo status method failed.");
      let result = null;
      let errorResult = null;
      // prepare functions
      const statusFn = jest.fn().mockRejectedValue(new Error("Get repo status method failed."));
      createGitFn = (simplegit as jest.Mock).mockImplementation(() => ({ // returns object with function silent
        silent: jest.fn().mockImplementation(() => ({ // returns object with function clone
          status: statusFn,
        })),
      }));

      // execute
      try {
        result = await gitService.getStatus(userName, repoKey);
      } catch (error) {
        errorResult = error;
      }

      // verify result
      expect(result).toBeNull();
      expect(errorResult.message).toMatchObject(expectedError.message);
      // verify method calls
      expect(createGitFn).toHaveBeenCalled();
      expect(createPathFn).toHaveBeenCalledWith(configService.basePath, userName, repoKey);
      expect(statusFn).toHaveBeenCalledWith();
      expect(logErrorFn).toHaveBeenCalled();
    });
  });
});
