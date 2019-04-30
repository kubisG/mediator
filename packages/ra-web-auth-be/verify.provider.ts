import { EnvironmentService } from "@ra/web-env-be/environment.service";
import { verifyServices } from "./constants";
import { DummyVerify } from "./verify/dummy-verify";
import { Verify } from "./verify/verify.interface";
import { DbVerify } from "./verify/db-verify";
import { UserRepository } from "@ra/web-dao/repositories/user.repository";

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
