import * as redis from "redis";

import { Logger } from "../../logger/providers/logger";
import { SessionStore } from "./session-store.interface";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { Inject } from "@nestjs/common";
// import { closeHandlers } from "../../../main";

export class RedisStore implements SessionStore {

    private redisClient;

    constructor(
        private env: EnvironmentService,
        @Inject("logger") private logger: Logger,
    ) {
        this.redisClient = redis.createClient(this.env.redis.port, this.env.redis.host);
        this.redisClient.on("error", (error) => {
            this.logger.error(error);
        });
        // closeHandlers.push(async () => {
        //     this.logger.warn(`Closing RedisStore`);
        //     await this.close();
        // });
    }

    public set(sid: string, data: any) {
        this.redisClient.set(sid, JSON.stringify(data));
    }

    public async get(sid: string) {
        const redisClient = this.redisClient;
        return new Promise((resolve, reject) => {
            if (!redisClient) {
                reject({ message: "redisClient undefined" });
                return;
            }
            redisClient.get(sid, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(reply));
                }
            });
        });
    }

    public close() {
        if (this.redisClient) {
            this.redisClient.quit();
            this.redisClient = undefined;
        }
    }

    destroy(sid: string) {
        this.redisClient.del(sid);
    }
}
