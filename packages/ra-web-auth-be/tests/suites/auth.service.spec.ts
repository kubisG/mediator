import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../../src/auth.service";
import { JwtAuthService } from "../../src/providers/jwt-auth.service";
import { BearerToken } from "../../src/interfaces/bearer-token.interface";
import { AuthDto } from "../../src/dto/auth.dto";

// mock services
jest.mock("../../src/providers/jwt-auth.service");

describe("AuthService", () => {
  let app: TestingModule;
  let authService: AuthService;
  let jwtAuthService: JwtAuthService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: "authService",
          useClass: JwtAuthService,
        },
      ],
    }).compile();

    jwtAuthService = app.get<JwtAuthService>("authService");
    authService = app.get<AuthService>(AuthService);
  });

  it("should create token", async () => {
    // prepare
    const input = { email: "test@test.cz", password: "test" } as AuthDto;
    const expectedResult = { firstName: "test", lastName: "test" } as BearerToken;
    jest.spyOn(jwtAuthService, "createToken").mockImplementation(async () => expectedResult);

    // execute
    const result = await authService.createToken(input);

    // verify
    expect(result).toBeDefined();
    expect(result.firstName).toEqual(expectedResult.firstName);
    expect(result.lastName).toEqual(expectedResult.lastName);
  });
});
