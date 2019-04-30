import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { AuthService } from "./auth.service";
import { BearerData } from "./interfaces/bearer-data.interface";
import { EnvironmentService } from "@ra/web-env-be/environment.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService, private env: EnvironmentService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: env.auth.secretKey,
        });
    }

    async validate(data: BearerData) {
        try {
            const user = await this.authService.validateUser(data);
            if (!user) {
                throw new UnauthorizedException();
            }
            return user;
        } catch (ex) {
            throw new UnauthorizedException();
        }
    }
}
