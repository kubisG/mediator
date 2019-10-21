import { Substitute, Arg } from "@fluffy-spoon/substitute";
import { Verify } from "../../../src/authentication/verify/verify.interface";
import { testEnv } from "../../environments/test-env";

export function getVerify() {
    const verify = Substitute.for<Verify>();

    verify.find(Arg.all()).returns(Promise.resolve({
        id: testEnv.userId,
        company: testEnv.company,
        class: testEnv.class,
        username: testEnv.username,
        firstName: testEnv.firstName,
        lastName: testEnv.lastName
    }));

    return verify;
}
