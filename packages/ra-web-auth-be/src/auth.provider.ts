import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { DummyAuthService } from "./providers/dummy-auth.service";
import { SessionDataService } from "./session-data/session-data.service";
import { JwtService } from "@nestjs/jwt";
import { VerifyService } from "./verify/verify.service";
import { Logger } from "@nestjs/common";
import { JwtAuthService } from "./providers/jwt-auth.service";
import { IAuthService } from "./providers/auth-service.interface";

export const authServiceFactory = {
    provide: "authService",
    useFactory: (
        env: EnvironmentService,
        jwtService: JwtService,
        verifyService: VerifyService,
        sessionDataService: SessionDataService,
        sessions: SessionStore,
        logger: Logger,
    ): IAuthService => {
        switch (env.auth) {
            case authService.jwt: {
                return new JwtAuthService(jwtService, verifyService, sessionDataService, sessions, logger);
            }
            case authService.remote: {
                return new RemoteAuthService();
            }
            case authService.dummy: {
                return new DummyAuthService();
            }
            default: {
                return new JwtAuthService();
            }
        }
    },
    inject: [EnvironmentService, SessionDataService, JwtService, VerifyService, SessionDataService, "session", "logger"],
};
