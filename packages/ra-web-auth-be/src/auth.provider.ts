import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { DummyAuthService } from "./providers/dummy-auth.service";
import { SessionDataService } from "./session-data/session-data.service";
import { JwtService } from "@nestjs/jwt";
import { VerifyService } from "./verify/verify.service";
import { Logger } from "@nestjs/common";
import { JwtAuthService } from "./providers/jwt-auth.service";
import { IAuthService } from "./interfaces/auth-service.interface";
import { SessionStore } from "@ra/web-core-be/dist/sessions/providers/session-store.interface";
import { AuthType } from "./enum/auth-type.enum";
import { HttpClient } from "./http-client.service";
import { RemoteAuthService } from "./providers/remote-auth.service";

export const authServiceFactory = {
    provide: "authService",
    useFactory: (
        env: EnvironmentService,
        jwtService: JwtService,
        verifyService: VerifyService,
        sessionDataService: SessionDataService,
        sessions: SessionStore,
        logger: Logger,
        httpClient: HttpClient,
    ): IAuthService => {
        switch (env.auth.type) {
            case AuthType.Jwt: {
                return new JwtAuthService(jwtService, verifyService, sessionDataService, sessions, logger);
            }
            case AuthType.Remote: {
                return new RemoteAuthService(httpClient, env, logger);
            }
            case AuthType.Dummy: {
                return new DummyAuthService(logger);
            }
            default: {
                return new JwtAuthService(jwtService, verifyService, sessionDataService, sessions, logger);
            }
        }
    },
    inject: [EnvironmentService, JwtService, VerifyService, SessionDataService, "sessions", "logger", HttpClient],
};
