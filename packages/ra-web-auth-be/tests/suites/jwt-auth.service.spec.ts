import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../../src/auth.service";
import { JwtAuthService } from "../../src/providers/jwt-auth.service";
import { BearerToken } from "../../src/interfaces/bearer-token.interface";
import { AuthDto } from "../../src/dto/auth.dto";
import { LoggerMock } from "../mocks/logger-mock";
import { SessionsStoreMock } from "../mocks/sessios.store-mock.service.";
import { JwtService } from "@nestjs/jwt";
import { VerifyService } from "../../src/verify/verify.service";
import { SessionDataService } from "../../src/session-data/session-data.service";
import { BearerData } from "../../src/interfaces/bearer-data.interface";

import * as uuid from "uuid/v4";

// mock services
jest.mock("../../src/session-data/session-data.service");
jest.mock("../../src/verify/verify.service");
jest.mock("@nestjs/jwt");
// mock library
jest.mock("uuid/v4");

describe("JwtAuthService", () => {
  let app: TestingModule;
  // original implementation
  let jwtAuthService: JwtAuthService;
  // mocks by jest
  let verifyService: VerifyService;
  let sessionDataService: SessionDataService;
  let jwtService: JwtService;
  // manual mocks
  let logger: LoggerMock;
  let sessions: SessionsStoreMock;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        JwtAuthService,
        JwtService,
        VerifyService,
        SessionDataService,
        {
          provide: "logger",
          useClass: LoggerMock,
        },
        {
          provide: "sessions",
          useClass: SessionsStoreMock,
        },
      ],
    }).compile();

    jwtAuthService = app.get<JwtAuthService>(JwtAuthService);
    jwtService = app.get<JwtService>(JwtService);
    verifyService = app.get<VerifyService>(VerifyService);
    sessionDataService = app.get<SessionDataService>(SessionDataService);
    logger = app.get<LoggerMock>("logger");
    sessions = app.get<SessionsStoreMock>("sessions");
  });

  describe("Test createToken method", () => {

    beforeAll(async () => {
      // common stuff for tests here
    });

    it("should not create token", async () => {
      // prepare results and inputs
      const input = { email: "invalid@email", password: "invalid" } as AuthDto;
      // prepare functions
      const findFn = jest.spyOn(verifyService, "find").mockImplementation(async () => null);
      const signFn = jest.spyOn(jwtService, "sign").mockReturnValue(null);

      // execute
      const result = await jwtAuthService.createToken(input);

      // verify function calls
      expect(findFn).toHaveBeenCalledWith(input);
      expect(signFn).not.toHaveBeenCalled();
      // verify result
      expect(result).toBeNull();
    });

    it("should create token", async () => {
      // prepare results and inputs
      const input = { email: "valid@user", password: "valid" } as AuthDto;
      const validUser = { firstName: "Valid", lastName: "User" };
      const accessToken = "header.payload.signature";
      const sid = "ce3873e6-0a98-4a54-8327-29920ee7a20b";
      const tokenData = { email: "invalid@email", sid: "mockedSid" } as BearerData;
      const sessionData = { email: "invalid@email", sid: "mockedSid" };
      const responseData = { accessToken: "header.payload.signature", firstName: "Valid", lastName: "User"} as BearerToken;
      const expectedResult = responseData;
      // prepare functions
      const findFn = jest.spyOn(verifyService, "find").mockImplementation(async () => validUser);
      const signFn = jest.spyOn(jwtService, "sign").mockReturnValue(accessToken);
      const verifyFn = jest.spyOn(jwtService, "verify").mockReturnValue(tokenData);
      const getSessionDataFn = jest.spyOn(sessionDataService, "getSessionData").mockImplementation(async () => sessionData);
      const getResponseDataFn = jest.spyOn(sessionDataService, "getResponseData").mockImplementation(async () => responseData);
      const setFn = jest.spyOn(sessions, "set").mockImplementation(() => {});
      // prepare library function
      const uuidFn = jest.spyOn(uuid, "default").mockReturnValue(sid);

      // execute
      const result = await jwtAuthService.createToken(input);

      // verify method calls
      expect(findFn).toHaveBeenCalledWith(input);
      expect(signFn).toHaveBeenCalledWith({email: input.email, sid});
      expect(verifyFn).toHaveBeenCalledWith(accessToken);
      expect(getSessionDataFn).toHaveBeenCalledWith(validUser, tokenData, accessToken);
      expect(getResponseDataFn).toHaveBeenCalledWith(validUser, tokenData, accessToken);
      expect(setFn).toHaveBeenCalledWith(sid, sessionData);
      expect(uuidFn).toHaveBeenCalled();
      // verify result
      expect(result).toBeDefined();
      expect(result.firstName).toEqual(expectedResult.firstName);
      expect(result.lastName).toEqual(expectedResult.lastName);
    });
  });

});
