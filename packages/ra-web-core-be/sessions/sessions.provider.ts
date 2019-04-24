import { RedisStore } from "./providers/redis-store";
import { SessionStore } from "./providers/session-store.interface";
import { sessionStore } from "./constants";
import { EnvironmentService } from "../../environments/environment.service";
import { Logger } from "../logger/providers/logger";

export const sessionStoreFactory = {
    provide: "sessions",
    useFactory: (env: EnvironmentService, logger: Logger): SessionStore => {
        switch (env.auth.sessionStore) {
            case sessionStore.redis: {
                return new RedisStore(env, logger);
            }
            default: {
                return new RedisStore(env, logger);
            }
        }
    },
    inject: [EnvironmentService, "logger"],
};
