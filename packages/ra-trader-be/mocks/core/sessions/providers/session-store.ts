import { Substitute, Arg } from "@fluffy-spoon/substitute";
import { SessionStore } from "@ra/web-core-be/dist/sessions/providers/session-store.interface";
import { testEnv } from "../../../environments/test-env";

export function getSessionStore() {
    const sessionStore = Substitute.for<SessionStore>();

    sessionStore.get(Arg.is(sid => sid === testEnv.sidOk)).returns(
        Promise.resolve({
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

    sessionStore.destroy(Arg.is(token => token === testEnv.tokenOk)).returns();
    return sessionStore;
}
