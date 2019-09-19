import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { createConnection, Connection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { NestFactory } from "@nestjs/core";
import { INestApplication } from "@nestjs/common";

export class InstallUtils {

    static async tryCreateDbConnection(env: EnvironmentService, tries: number = 0): Promise<Connection> {
        try {
            const connection: Connection = await createConnection({
                name: "test",
                type: env.db.type,
                schema: env.db.schema,
                host: env.db.host,
                port: env.db.port,
                username: env.db.user,
                password: env.db.password,
                database: env.db.db,
                entities: [],
                synchronize: env.db.synch,
                logging: true,
                logger: "advanced-console",
            } as PostgresConnectionOptions);
            return connection;
        } catch (ex) {
            console.log("tryCreateDbConnection", ex.message);
            if (tries > 0) {
                console.log("TRY CONNECT AGAIN");
                return await InstallUtils.tryCreateDbConnection(env, tries - 1);
            } else {
                throw ex;
            }
        }
    }

    static async initDbFromModule(nestModuel: any): Promise<INestApplication> {
        const app: INestApplication = await NestFactory.create(nestModuel);
        return app;
    }

}
