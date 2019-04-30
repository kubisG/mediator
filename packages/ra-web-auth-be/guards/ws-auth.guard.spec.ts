import { WsAuthGuard } from "./ws-auth.guard";
import { ExecutionContext } from "@nestjs/common";
import { getJwtService } from "../../../mocks/dependecies/jwt.service";
import { getAuthService } from "../../../mocks/authentication/auth.service";
import { getLogger } from "../../../mocks/core/logger/providers/logger";
import { getExecutionContext, getExecutionContextFail } from "../../../mocks/dependecies/execution-context";

describe("WsAuthGuard", () => {

    let wsAuthGuard: WsAuthGuard;

    beforeEach(async () => {

        wsAuthGuard = new WsAuthGuard(
            getJwtService(),
            getAuthService(),
            getLogger(),
        );

    });

    describe("canActivate", () => {
        it("should return true", async () => {
            const result = await wsAuthGuard.canActivate(getExecutionContext() as ExecutionContext);
            expect(result).toEqual(true);
        });
        it("should return false", async () => {
            const result = await wsAuthGuard.canActivate(getExecutionContextFail() as ExecutionContext);
            expect(result).toEqual(false);
        });
    });

});
