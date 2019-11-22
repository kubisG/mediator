import { Test, TestingModule } from "@nestjs/testing";
import { FileService } from "../../src/file/file.service";
import { ConfigService } from "../../src/config/config.service";
import { InternalServerErrorException } from "@nestjs/common";

import * as _fs from "fs";
import * as _path from "path";
import { FileContentDto } from "src/file/dto/file-content.dto";

// mock services
jest.mock("../../src/config/config.service");

describe("FileService", () => {
  let fileService: FileService;
  let configService: ConfigService;

  const userName = "testUserName";
  const repoKey = "testRepoKey";
  const relativeFilePath = "testRelativeFilePath";
  const basePath = _path.resolve("testBasePath");
  const path = _path.join(basePath, userName, repoKey, relativeFilePath);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        ConfigService,
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
    fileService = module.get<FileService>(FileService);
    // mock getter, cannot be mocked by jest
    Object.defineProperty(configService, "basePath", { configurable: true, get: jest.fn(() => "testBasePath") });
  });

  describe("Test getFiles method", () => {
    let readdirFn;
    // set up directories
    const dir1 = new _fs.Dirent();
    const file1 = new _fs.Dirent();
    const file2 = new _fs.Dirent();
    const file3 = new _fs.Dirent();
    // set up names
    dir1.name = "Dir1";
    file1.name = "File1";
    file2.name = "File2";
    file3.name = "File3";
    // set up diractory flags
    jest.spyOn(dir1, "isDirectory").mockReturnValue(true);

    beforeEach(async () => {
      jest.spyOn(configService, "basePath", "get").mockReturnValue("testBasePath");
    });

    it("should get list of files recursively", async () => {
      // prepare input and results
      const recursive = false;
      // prepare functions
      readdirFn = jest.spyOn(_fs.promises, "readdir").mockImplementation(async () => [file1, file2, dir1]);

      // execute
      const result = await fileService.getFiles(userName, repoKey, relativeFilePath, recursive);

      // verify function calls
      expect(readdirFn).toHaveBeenCalledTimes(1);
      // verify result
      expect(result).toBeDefined();
    });

    it("should get list of files non recursively", async () => {
      // prepare results and inputs
      const recursive = true;
      // prepare functions
      readdirFn = jest.spyOn(_fs.promises, "readdir") // THIS IS KEY TO RECURSIVE FUNCTION TESTS
        .mockImplementationOnce(async () => [file1, file2, dir1]) // first function call
        .mockImplementationOnce(async () => [file2, file3]); // second function call (and last cause there is no other dir)

      // execute
      const result = await fileService.getFiles(userName, repoKey, relativeFilePath, recursive);

      // verify function calls
      expect(readdirFn).toHaveBeenCalledTimes(2);
      // verify result
      expect(result).toBeDefined();
    });

    it("should throw exception if file system operation failed", async () => {
      // prepare results and inputs
      let result = null;
      let errorResult = null;
      const recursive = false;
      const expectedError = new InternalServerErrorException("Fail during processing file: undefined");
      // prepare functions
      readdirFn = jest.spyOn(_fs.promises, "readdir").mockRejectedValue(new Error("ENOENT"));

      // execute
      try {
        result = await fileService.getFiles(userName, repoKey, relativeFilePath, recursive);
      } catch (error) {
        errorResult = error;
      }

      // verify function calls
      expect(readdirFn).toHaveBeenCalledTimes(1);
      // verify result
      expect(result).toBeNull();
      expect(errorResult.message).toMatchObject(expectedError.message);
    });

    it("should throw exception if file system operation failed for get files recursive", async () => {
      // prepare results and inputs
      let result = null;
      let errorResult = null;
      const recursive = true;
      const expectedError = new InternalServerErrorException("Fail during processing file: undefined");
      // prepare functions
      readdirFn = jest.spyOn(_fs.promises, "readdir").mockRejectedValue(new Error("ENOENT"));

      // execute
      try {
        result = await fileService.getFiles(userName, repoKey, relativeFilePath, recursive);
      } catch (error) {
        errorResult = error;
      }

      // verify function calls
      expect(readdirFn).toHaveBeenCalledTimes(1);
      // verify result
      expect(result).toBeNull();
      expect(errorResult.message).toMatchObject(expectedError.message);
    });

    afterEach(() => {
      // needs to be called after each test, otherwise it's accumulate calls from previous tests
      readdirFn.mockReset();
    });
  });

  describe("Test getFile method", () => {
    let readFileFn;
    const fileContent: string = "Text content of file";

    beforeEach(async () => {
      jest.spyOn(configService, "basePath", "get").mockReturnValue("testBasePath");
    });

    it("should return file content with default encoding", async () => {
      // prepare input and results
      const encoding: BufferEncoding = "utf-8";
      const expectedResult = { type: "json", content: fileContent } as FileContentDto;
      const currPath = _path.join(path, "file.json");
      // prepare functions
      readFileFn = jest.spyOn(_fs.promises, "readFile").mockResolvedValue(fileContent);

      // execute
      const result = await fileService.getFile(userName, repoKey, `${relativeFilePath}/file.json`);

      // verify function calls
      expect(readFileFn).toHaveBeenCalledTimes(1);
      expect(readFileFn).toHaveBeenCalledWith(currPath, { encoding });
      // verify result
      expect(result).toEqual(expectedResult);
    });

    it("should return error if file system operation fails", async () => {
      // prepare input and results
      let result = null;
      let errorResult = null;
      const encoding: BufferEncoding = "ascii";
      const currPath = _path.join(path, "file.json");
      const expectedError = new InternalServerErrorException("Fail during processing file: undefined");
      // prepare functions
      readFileFn = jest.spyOn(_fs.promises, "readFile").mockRejectedValue(new Error("ENOENT"));

      // execute
      try {
        result = await fileService.getFile(userName, repoKey, `${relativeFilePath}/file.json`, encoding);
      } catch (error) {
        errorResult = error;
      }

      // verify function calls
      expect(readFileFn).toHaveBeenCalledTimes(1);
      expect(readFileFn).toHaveBeenCalledWith(currPath, { encoding });
      // verify result
      expect(result).toBeNull();
      expect(errorResult.message).toMatchObject(expectedError.message);
    });

    afterEach(() => {
      // needs to be called after each test, otherwise it's accumulate calls from previous tests
      readFileFn.mockReset();
    });
  });
});
