
import { AuthService } from "@ra/web-auth-be/dist/auth.service";
import { DbVerify } from "../users/db-verify";
import { RaUserSessionData } from "../users/ra-user-session-data";

export const webAuthProvider = [
    {
        provide: "WebAuthProvider",
        useFactory: async (
            authService: AuthService,
            verifyService: DbVerify,
            sessionData: RaUserSessionData,
        ): Promise<AuthService> => {
            authService.setVerifyService(verifyService);
            authService.setSessionDataService(sessionData);
            return authService;
        },
        inject: [
            AuthService,
            DbVerify,
            RaUserSessionData
        ]
    }];
