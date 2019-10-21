import { Substitute, Arg } from "@fluffy-spoon/substitute";
import { ExecutionContext } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { getHttpArgumentsHost, getHttpArgumentsHostFail } from "./http-arguments-host";

export function getExecutionContext() {
    const executionContext = Substitute.for<ExecutionContext>();
    executionContext.switchToHttp().returns(getHttpArgumentsHost() as HttpArgumentsHost);
    return executionContext;
}

export function getExecutionContextFail() {
    const executionContextFail = Substitute.for<ExecutionContext>();
    executionContextFail.switchToHttp().returns(getHttpArgumentsHostFail() as HttpArgumentsHost);
    return executionContextFail;
}
