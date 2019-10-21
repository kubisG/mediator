import { Substitute, Arg } from "@fluffy-spoon/substitute";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { testEnv } from "../environments/test-env";

export function getHttpArgumentsHost() {
    const httpArgumentsHost = Substitute.for<HttpArgumentsHost>();
    httpArgumentsHost.getRequest().returns({
        handshake: {
            query: {
                token: testEnv.tokenOk,
            }
        }
    });
    return httpArgumentsHost;
}

export function getHttpArgumentsHostFail() {
    const httpArgumentsHostFail = Substitute.for<HttpArgumentsHost>();

    httpArgumentsHostFail.getRequest().returns({
        handshake: {
            query: {
                token: testEnv.tokenFail,
            }
        }
    });
    return httpArgumentsHostFail;
}
