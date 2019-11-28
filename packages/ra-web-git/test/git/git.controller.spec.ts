import { Test, TestingModule } from "@nestjs/testing";
import { GitController } from "../../src/git/git.controller";
import { GitService } from "../../src/git/git.service";

jest.mock("../../src/git/git.service");

describe("Git Controller", () => {
  let controller: GitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GitController],
      providers: [GitService],
    }).compile();

    controller = module.get<GitController>(GitController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
