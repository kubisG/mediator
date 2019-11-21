import { Test, TestingModule } from "@nestjs/testing";
import { GitController } from "../../src/git/git.controller";

describe("Git Controller", () => {
  let controller: GitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GitController],
    }).compile();

    controller = module.get<GitController>(GitController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
