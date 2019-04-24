import { createParamDecorator } from "@nestjs/common";

export const Bearer = createParamDecorator((data, req) => {
    let authHeader;
    if (data) {
        authHeader = req.headers[data];
    } else {
        authHeader = req.headers["authorization"];
    }
    if (authHeader) {
        const splitedAuthHeader = authHeader.split(" ");
        if (splitedAuthHeader.length > 1) {
            return splitedAuthHeader[1];
        }
    }
    return "";
});
