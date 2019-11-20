import { Test, TestingModule } from "@nestjs/testing";
import { FileController } from "../../src/file/file.controller";
import { FileService } from "../../src/file/file.service";

// mock services
jest.mock("../../src/file/file.service");

describe("File Controller", () => {
  let controller: FileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
      controllers: [FileController],
    }).compile();

    controller = module.get<FileController>(FileController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
