import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "@ra/web-auth-be/dist/auth.service";

@Injectable()
export class TokenAuthGuard implements CanActivate {

  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log("request", request);
    return true;
  }
}
