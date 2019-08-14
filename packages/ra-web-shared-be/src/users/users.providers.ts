import { SessionDataService } from "@ra/web-auth-be/dist/session-data/session-data.service";
import { UserSessionData } from "./user-session-data";
import { VerifyService } from "@ra/web-auth-be/dist/verify/verify.service";
import { UserAuthVerify } from "./user-auth-verify";

export const userSessionDataProvider = {
    provide: SessionDataService,
    useClass: UserSessionData,
};

export const userAuthVerifyProvider = {
    provide: VerifyService,
    useClass: UserAuthVerify,
}
