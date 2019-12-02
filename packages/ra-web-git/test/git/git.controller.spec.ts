import { Test, TestingModule } from "@nestjs/testing";
import { GitController } from "../../src/git/git.controller";
import { GitService } from "../../src/git/git.service";
import { CloneRequestDto } from "src/git/dto/clone-request.dto";
import { HttpStatus, InternalServerErrorException } from "@nestjs/common";

import * as request from "supertest";

jest.mock("../../src/git/git.service");

describe("Git Controller", () => {
  let app;
  let requester;
  let gitService: GitService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [GitController],
      providers: [GitService],
    }).compile();

    app = moduleFixture.createNestApplication();
    gitService = moduleFixture.get<GitService>(GitService);
    // set up requester
    requester = request(app.getHttpServer());
    // run app to be able call endpoints
    await app.init();
  });

  describe("Test clone method", () => {
    let cloneFn;
    // set up url and url parts
    const userName: string = "testUserName";
    const repoKey: string = "testRepoKey";
    const gitUserName: string = "testGitUserName";
    const gitPassword: string = "testGitPassword";
    const repoPath: string = "testRepoPath/test.git";
    const cloneRequest = { userName: gitUserName, password: gitPassword, repoPath } as CloneRequestDto;
    const url: string = `/git/${userName}/${repoKey}`;

    beforeEach(async () => { });

    it("should clone repo and return success result", async (done) => {
      // prepare results
      const expectedResult = "success";
      // prepare functions
      cloneFn = jest.spyOn(gitService, "clone").mockResolvedValue("success");

      // execute
      const response = await requester.post(url).send(cloneRequest);

      // verify method calls
      expect(cloneFn).toHaveBeenCalledTimes(1);
      expect(cloneFn).toHaveBeenCalledWith(userName, repoKey, cloneRequest);
      // verify result
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.text).toEqual(expectedResult);

      // call done when finish
      done();
    });

    it("should return error If clone method failed", async (done) => {
      // prepare results
      const error = new InternalServerErrorException("Failed");
      const expectedResult = { statusCode: 500, error: "Internal Server Error", message: "Failed" };
      // prepare functions
      cloneFn = jest.spyOn(gitService, "clone").mockRejectedValue(error);

      // execute
      const response = await requester.post(url).send(cloneRequest);

      // verify method calls
      expect(cloneFn).toHaveBeenCalledTimes(1);
      expect(cloneFn).toHaveBeenCalledWith(userName, repoKey, cloneRequest);
      // verify result
      // verify result
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.body).toMatchObject(expectedResult);

      // call done when finish
      done();
    });

    afterEach(() => {
      // needs to be called after each test, otherwise it's accumulate calls from previous tests
      cloneFn.mockReset();
    });
  });
});
