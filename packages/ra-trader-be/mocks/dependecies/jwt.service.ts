import { Substitute, Arg } from "@fluffy-spoon/substitute";
import { JwtService } from "@nestjs/jwt";
import { testEnv } from "../environments/test-env";

export function getJwtService() {
    const jwtService = Substitute.for<JwtService>();
    jwtService.sign(Arg.all()).returns(testEnv.tokenOk);
    jwtService.verify(Arg.is(token => token === testEnv.tokenOk)).returns({
        email: testEnv.email,
        sid: testEnv.sidOk,
        iat: testEnv.iat,
        exp: testEnv.exp,
    });
    jwtService.verify(Arg.is(token => token === testEnv.tokenFail)).returns(undefined);
    return jwtService;
}
