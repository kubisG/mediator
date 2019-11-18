import { CanActivate, ExecutionContext, Injectable, Logger, Inject } from "@nestjs/common";
import { AuthService } from "../auth.service";

import * as _ from "lodash";

@Injectable()
export class TokenAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    @Inject("logger") protected logger: Logger,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractBearerToken(request.headers.authorization);
    let verifiedToken = null;

    try {
      verifiedToken = await this.authService.verifyToken(token);
    } catch (error) {
      // cannot throw any exception here cause it is not handeled correctly by nest
      this.logger.error("Token verification failed", `Inner message: ${error.message}`, "TokenAuthGuard");
    }
    return !_.isNil(verifiedToken);
  }

  private extractBearerToken(auth: string): string | null {
    return (auth && auth.startsWith("Bearer ")) ? auth.split(" ")[1] : null;
  }
}
