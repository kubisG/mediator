import { Test, TestingModule } from "@nestjs/testing";
import { GitService } from "../../src/git/git.service";
import { ConfigService } from "../../src/config/config.service";
import { Logger } from "@nestjs/common";

jest.mock("../../src/config/config.service");

describe("GitService", () => {
  let service: GitService;

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

    service = module.get<GitService>(GitService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
