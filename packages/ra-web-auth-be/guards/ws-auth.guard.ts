import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AuthService } from "../auth.service";
import { BearerData } from "../interfaces/bearer-data.interface";
import { Logger } from "@ra/web-core-be/src/logger/providers/logger";

@Injectable()
export class WsAuthGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,
        private authService: AuthService,
        @Inject("logger") private logger: Logger,
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        try {
            const data: BearerData = this.jwtService.verify<BearerData>(request.handshake.query.token);
            const user = await this.authService.validateUser(data);
            if (data && user) {
                return true;
            }
            this.logger.warn("WsAuthGuard UNAUTHORIZED");
            return false;
        } catch (ex) {
            return false;
        }
    }
}
