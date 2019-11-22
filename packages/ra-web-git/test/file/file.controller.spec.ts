import { Test, TestingModule } from "@nestjs/testing";
import { FileController } from "../../src/file/file.controller";
import { FileService } from "../../src/file/file.service";
import { FileDto } from "src/file/dto/file.dto";
import { HttpStatus, InternalServerErrorException } from "@nestjs/common";
import { FileContentDto } from "src/file/dto/file-content.dto";

import * as request from "supertest";

// mock services
jest.mock("../../src/file/file.service");

describe("FileController", () => {
  let app;
  let fileService: FileService;
  let requester: request.SuperTest<request.Test>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [FileService],
      controllers: [FileController],
    }).compile();

    app = moduleFixture.createNestApplication();
    fileService = moduleFixture.get<FileService>(FileService);
    // set up requester
    requester = request(app.getHttpServer());
    // run app to be able call endpoints
    await app.init();
  });

  describe("Test getFile method", () => {
    let getFileFn;
    // set up url and url parts
    const userName: string = "testUserName";
    const repoKey: string = "testRepoKey";
    const relativePath: string = "testRelativePath";
    const url: string = `/files/${userName}/${repoKey}/${relativePath}%2Ffile.json/content`;

    beforeEach(async () => { });

    it("should return file content", async (done) => {
      // prepare
      const file = { type: "properties", content: "Text file content"} as FileContentDto;
      const expectedResult = file;
      // prepare functions
      getFileFn = jest.spyOn(fileService, "getFile").mockResolvedValue({ type: "properties", content: "Text file content"});

      // execute
      const response = await requester.get(url);

      // verify method calls
      expect(getFileFn).toHaveBeenCalledTimes(1);
      expect(getFileFn).toHaveBeenCalledWith(userName, repoKey, `${relativePath}/file.json`); // verify all url params has been bind correctly
      // verify result
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject(expectedResult)

      // call done when finish
      done();
    });

    it("should return error If get info method fails", async (done) => {
      // prepare
      const error = new InternalServerErrorException("Failed");
      const expectedResult = { statusCode: 500, error: "Internal Server Error", message: "Failed" };
      // prepare functions
      getFileFn = jest.spyOn(fileService, "getFile").mockRejectedValue(error);

      // execute
      const response = await requester.get(url);

      // verify method calls
      expect(getFileFn).toHaveBeenCalledTimes(1);
      expect(getFileFn).toHaveBeenCalledWith(userName, repoKey, `${relativePath}/file.json`); // verify all url params has been bind correctly
      // verify result
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.body).toMatchObject(expectedResult);

      // call done when finish
      done();
    });

    afterEach(() => {
      // needs to be called after each test, otherwise it's accumulate calls from previous tests
      getFileFn.mockReset();
    });
  });

  describe("Test getFiles method", () => {
    let readdirFn;
    const basePath: string = "/path/base/";
    // set up url and url parts
    const userName: string = "testUserName";
    const repoKey: string = "testRepoKey";
    const relativePath: string = "testRelativePath";
    const url: string = `/files/${userName}/${repoKey}/${relativePath}`;
    // set up files
    const file1: FileDto = { name: "file1.txt", path: `${basePath}/file1.txt`, directory: false };
    const file2: FileDto = { name: "file2.txt", path: `${basePath}/file2.txt`, directory: false };
    const dir1: FileDto = { name: "dir1", path: `${basePath}/dir1`, directory: true };

    beforeEach(async () => { });

    it("should get list of files", async (done) => {
      // prepare
      const files = [file1, file2, dir1] as FileDto[];
      const expectedResult = files;
      const recursive = false;
      // prepare functions
      readdirFn = jest.spyOn(fileService, "getFiles").mockResolvedValue(files);

      // execute
      const response = await requester.get(url).query({recursive}); // query params here

      // verify method calls
      expect(readdirFn).toHaveBeenCalledTimes(1);
      expect(readdirFn).toHaveBeenCalledWith(userName, repoKey, relativePath, recursive); // verify all url params has been bind correctly
      // verify result
      expect(response.status).toBe(HttpStatus.OK); // always use HttpStatus over number value
      expect(response.body).toMatchObject(expectedResult); // user toMatchObject over toBe (serialization)

      // call done when finish
      done();
    });

    it("should return error If get info method fails", async (done) => {
      // prepare
      const error = new InternalServerErrorException("Failed");
      const expectedResult = { statusCode: 500, error: "Internal Server Error", message: "Failed" };
      const recursive = true;
      // prepare functions
      readdirFn = jest.spyOn(fileService, "getFiles").mockRejectedValue(error);

      // execute
      const response = await requester.get(url).query({recursive});

      // verify method calls
      expect(readdirFn).toHaveBeenCalledTimes(1);
      expect(readdirFn).toHaveBeenCalledWith(userName, repoKey, relativePath, recursive); // verify all url params has been bind correctly
      // verify result
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR); // always use HttpStatus over number value
      expect(response.body).toMatchObject(expectedResult); // user toMatchObject over toBe (serialization)

      // call done when finish
      done();
    });

    afterEach(() => {
      // needs to be called after each test, otherwise it's accumulate calls from previous tests
      readdirFn.mockReset();
    });
  });
});