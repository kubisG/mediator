import * as dotenv from "dotenv";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { Connection, createConnection, getConnectionManager, ConnectionManager, Driver } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { thisExpression } from "@babel/types";
import { InstallUtils } from "@ra/web-core-be/dist/install/install-utils";
import { INestApplication } from "@nestjs/common";

dotenv.config();

function exitErr(err: any) {
    console.log("ERR", err);
    process.exit(1);
}

function exitOk() {
    process.exit(0);
}

async function install(connection: Connection) {
    await connection.close();
    process.env.DB_SYNCH = "true";
    process.env.DB_LOGGING = "true";
    const app: INestApplication = await InstallUtils.initDbFromModule(AppModule);
    app.close();
    exitOk();
}

InstallUtils.tryCreateDbConnection(new EnvironmentService(), 10).then((connection: Connection) => {
    install(connection).then(() => {
        exitOk();
    }).catch((err) => {
        exitErr(err);
    });
}).catch((err) => {
    exitErr(err);
});
