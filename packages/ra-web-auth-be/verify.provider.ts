import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { verifyServices } from "./constants";
import { DummyVerify } from "./verify/dummy-verify";
import { Verify } from "./verify/verify.interface";
import { DbVerify } from "./verify/db-verify";
import { UserRepository } from "@ra/web-dao/repositories/user.repository";
import { PreferencesService } from "@ra/web-core-be/preferences.service";
import { RaUserSessionData } from "./session-data/ra-user-session-data";

export const verifyServiceFactory = {
    provide: "verifyService",
    useFactory: (env: EnvironmentService, raUser: UserRepository): Verify => {
        switch (env.verifyService.provider) {
            case verifyServices.dummy: {
                return new DummyVerify();
            }
            case verifyServices.db: {
                return new DbVerify(raUser);
            }
            default: {
                return new DummyVerify();
            }
        }
    },
    inject: [EnvironmentService, "userRepository"],
};

export const sessionDataFactory = {
    provide: "sessionData",
    useFactory: (env: EnvironmentService, preferencesService: PreferencesService) => {
        return new RaUserSessionData(env, preferencesService);
    },
    inject: [EnvironmentService, PreferencesService],
};
