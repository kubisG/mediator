import { Substitute, Arg } from "@fluffy-spoon/substitute";
import { AuthService } from "../../src/authentication/auth.service";
import { testEnv } from "../environments/test-env";

export function getAuthService() {
    const authService = Substitute.for<AuthService>();
    authService.validateUser(Arg.is(x => x.sid === testEnv.sidOk)).returns(Promise.resolve({
        email: testEnv.email,
        sid: testEnv.sidOk,
        iat: testEnv.iat,
        exp: testEnv.exp,
        compQueue: testEnv.compQueue,
        compId: testEnv.compId,
        userId: testEnv.userId,
        role: testEnv.role,
        nickName: testEnv.nickName
    }));

    authService.validateUser(Arg.is(x => x.sid === testEnv.sidFail)).returns(Promise.reject({
        error: true,
    }));

    authService.createToken(
        Arg.is(x => x.email === testEnv.email && x.password === testEnv.password)
    ).returns(Promise.resolve({
        expiresIn: 1000,
        accessToken: testEnv.tokenOk,
        role: testEnv.role,
        rows: testEnv.prefRows,
        theme: testEnv.prefTheme,
        id: testEnv.userId,
        firstName: testEnv.firstName,
        lastName: testEnv.lastName,
        companyName: testEnv.company.companyName,
        nickName: testEnv.nickName,
        compQueue: testEnv.compQueue,
        compId: testEnv.compId,
        app: testEnv.app,
        appPrefs: null,
        compQueueTrader: testEnv.compQueue,
        compQueueBroker: testEnv.compQueue,
    }));

    authService.verifyToken(Arg.is(x => x === testEnv.tokenOk)).returns({
        email: testEnv.email,
        sid: testEnv.sidOk,
        iat: testEnv.iat,
        exp: testEnv.exp
    });

    authService.getUserData(Arg.is(x => x === testEnv.tokenOk)).returns(Promise.resolve({
        email: testEnv.email,
        sid: testEnv.sidOk,
        iat: testEnv.iat,
        exp: testEnv.exp,
        compQueue: testEnv.compQueue,
        compId: testEnv.compId,
        userId: testEnv.userId,
        role: testEnv.role,
        nickName: testEnv.nickName
    }));

    return authService;
}
