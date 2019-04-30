import { Injectable, CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

import { AuthService } from "../auth.service";
import { BearerData } from "../interfaces/bearer-data.interface";
import { Logger } from "@ra/web-core-be/logger/providers/logger";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector,
        private jwtService: JwtService,
        private authService: AuthService,
        @Inject("logger") private logger: Logger,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        try {
            const data: BearerData = this.jwtService.verify<BearerData>(request.headers.authorization.replace("Bearer ", ""));

            const user = await this.authService.validateUser(data);

            if (user) {
                const roles = this.reflector.get<string[]>("roles", context.getHandler());
                if (!roles) {
                    return true;
                }
                const hasRole = () => (roles.indexOf(user.role) > -1);

                return user && user.role && hasRole();
            } else {
                this.logger.warn("RolesGuard UNAUTHORIZED");
                return false;
            }
        } catch (ex) {
            return false;
        }
    }
}

