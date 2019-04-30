import { AuthService } from "./auth.service";
import { getJwtService } from "../../mocks/dependecies/jwt.service";
import { getSessionStore } from "../../mocks/core/sessions/providers/session-store";
import { getVerify } from "../../mocks/authentication/verify/verify";
import { getPreferenceService } from "../../mocks/core/preferences.service";
import { getLogger } from "../../mocks/core/logger/providers/logger";
import { getEnvironmentService } from "../../mocks/environments/environment.service";

describe("AuthService", () => {

    let authService: AuthService;
    let environmentService;

    beforeEach(async () => {

        environmentService = getEnvironmentService();

        authService = new AuthService(
            getJwtService(),
            getSessionStore(),
            getVerify(),
            getPreferenceService(),
            getLogger(),
            environmentService,
        );

    });

    // describe("createToken", () => {
    //     it("should be object with jwt token", async () => {
    //         const token = await authService.createToken({ email: "test@rapidaddition.com", password: "123456789" });
    //         expect(token).toEqual({
    //             expiresIn: 1000,
    //             accessToken: "fake-token-ok",
    //             role: "ADMIN",
    //             rows: 10,
    //             theme: "node",
    //             id: 1,
    //             firstName: "test",
    //             lastName: "test",
    //             companyName: "RAPID",
    //             nickName: "test"
    //         });
    //     });
    // });

    describe("validateUser", () => {
        it("should be user object", async () => {
            const userData = await authService.validateUser({ email: "test@rapidaddition.com", sid: "fake-sid-ok" });
            expect(userData).toEqual({
                email: "test@rapidaddition.com",
                sid: "fake-sid-ok",
                iat: 123,
                exp: 123,
                compQueue: "prefix1",
                compId: 1,
                userId: 1,
                role: "ADMIN",
                nickName: "test"
            });
        });
    });

    describe("destroySession", () => {
        it("delete user session", async () => {
            const result = await authService.destroySession("fake-token-ok");
            expect(result).toEqual(undefined);
        });
    });

});
