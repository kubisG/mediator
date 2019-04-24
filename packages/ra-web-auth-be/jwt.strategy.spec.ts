import { JwtStrategy } from "./jwt.strategy";
import { getAuthService } from "../../mocks/authentication/auth.service";
import { getEnvironmentService } from "../../mocks/environments/environment.service";
import { UnauthorizedException } from "@nestjs/common";

describe("JwtStrategy", () => {

    let jwtStrategy: JwtStrategy;

    beforeEach(async () => {
        jwtStrategy = new JwtStrategy(
            getAuthService(),
            getEnvironmentService(),
        );
    });

    describe("validate", () => {
        it("should be object with bearer data", async () => {
            const result = await jwtStrategy.validate({
                email: "test@rapidaddition.com",
                sid: "fake-sid-ok"
            });
            expect(result).toEqual({
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
        it("should be UnauthorizedException", async () => {
            try {
                const result = await jwtStrategy.validate({
                    email: "test@rapidaddition.com",
                    sid: "fake-sid-fail"
                });
                expect(true).toEqual(false);
            } catch (ex) {
                expect(true).toEqual(true);
            }
        });
    });

});
