import * as utils from "../src/utils";
import * as _path from "path";

describe("Utils", () => {

    it("should return file extension", () => {
        // prepare
        const input = "test-directory/file.json";
        const expectedResult = "json";

        // execute
        const result = utils.getFileExtension(input);

        // verify
        expect(result).toEqual(expectedResult);
    });

    it("should return null if input string is null", () => {
        // prepare
        const input = null;

        // execute
        const result = utils.getFileExtension(input);

        // verify
        expect(result).toBeNull();
    });

    it("should return directory name", () => {
        // prepare
        const input = "gitlab.com/rapid-addition/ra-platform/ra-web/ra-web-fe.git";
        const expectedResult = "ra-web-fe";

        // execute
        const result = utils.getDirectoryName(input);

        // verrify
        expect(result).toEqual(expectedResult);
    });

    it("should return null if url is null", () => {
        // prepare
        const input = null;

        // execute
        const result = utils.getDirectoryName(input);

        // verrify
        expect(result).toBeNull();
    });

    it("should return sanitized file path", () => {
        // prepare
        const basePath = _path.resolve("testBasePath");
        const testPart1 = "testPart1";
        const testPart2 = "testPart2";
        const expectedResult = _path.join(basePath, testPart1, testPart2);

        // execute
        const result = utils.createPath(basePath, testPart1, testPart2);

        // verify
        expect(result).toEqual(expectedResult);
    });

    it("should return null if any part of file path is null", () => {
        // prepare
        const basePath = _path.resolve("testBasePath");
        const testPart1 = null;
        const testPart2 = "testPart2";

        // execute
        const result = utils.createPath(basePath, testPart1, testPart2);

        // verify
        expect(result).toBeNull();
    });

});