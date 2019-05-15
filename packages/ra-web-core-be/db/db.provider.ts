import { Connection, createConnection, getConnectionManager } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { EnvironmentService } from "@ra/web-env-be/environment.service";

export function dataseProviders(entities: any[]) {
    return [
        {
            provide: "DbConnection",
            useFactory: async (env: EnvironmentService): Promise<Connection> => {
                if (getConnectionManager().has("default")) {
                    return getConnectionManager().get("default");
                }
                const connection = await createConnection({
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
                    logger: "advanced-console"
                } as PostgresConnectionOptions);
                return connection;
            },
            inject: [EnvironmentService],
        },
    ]
}
