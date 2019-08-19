import { Connection, createConnection, getConnectionManager, ConnectionManager, Driver } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { Logger } from "../logger/providers/logger";

export function dataseProviders(entities: any[]) {
    return [
        {
            provide: "DbConnection",
            useFactory: async (env: EnvironmentService, logger: Logger): Promise<() => Connection> => {
                logger.silly(`PASS ENTITIES, COUNT: ${entities.length}`);
                console.log(entities);
                const connectionManager: ConnectionManager = getConnectionManager();
                let connection: Connection;
                let driver: Driver;
                if (connectionManager.has("default")) {
                    connection = connectionManager.get("default");
                    return () => {
                        logger.silly(`RETURN EXISTING DB CONNECTION`);
                        return connectionManager.get("default");
                    };
                }
                logger.silly(`BEFORE NEW DB CONNECTION`);
                connection = await createConnection({
                    type: env.db.type,
                    schema: env.db.schema,
                    host: env.db.host,
                    port: env.db.port,
                    username: env.db.user,
                    password: env.db.password,
                    database: env.db.db,
                    entities: [
                        ...entities,
                    ],
                    synchronize: env.db.synch,
                    logging: ((env.logging.db === "true" || env.logging.db === true) ? true : ["error"]),
                    logger: "advanced-console",
                } as PostgresConnectionOptions);
                logger.silly(`GET NEW DB CONNECTION`);

                if (driver) {
                    await driver.connect();
                    logger.silly(`GET DRIVER CONNECTION`);
                }
                return () => {
                    logger.silly(`RETURN DB CONNECTION`);
                    return connectionManager.get("default");
                };
            },
            inject: [EnvironmentService, "logger"],
        },
    ];
}

export function databaseRepos(form, repo) {
    const handler = {
        get(target, propKey, receiver) {
            const targetValue = Reflect.get(target, propKey, receiver);
            const repoValue = Reflect.get(repo, propKey, repo);
            if (typeof targetValue === "function") {
                return (...args) => {
                    return targetValue.apply(form, args);
                };
            } else if (typeof repoValue === "function") {
                return (...args) => {
                    return repoValue.apply(repo, args);
                };
            } else {
                return targetValue;
            }
        },
    };
    return new Proxy(form, handler);
}
