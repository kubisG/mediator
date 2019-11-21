import { Test, TestingModule } from "@nestjs/testing";
import { FileModule } from "src/file/file.module";

describe("AppController (e2e)", () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FileModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("should return files", () => {

  });

  it("should return files recursively", () => {

  });
});
