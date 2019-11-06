import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { AppModule } from "./app.module";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { Connection } from "typeorm";
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

async function install(connection: Connection, enviroment: EnvironmentService) {
    await connection.close();
    process.env.DB_SYNCH = "true";
    process.env.DB_LOGGING = "true";
    const app: INestApplication = await InstallUtils.initDbFromModule(AppModule);
    const newConnection = app.get("DbConnection");
    await updateToDB(newConnection(), enviroment);
    app.close();
}

async function updateToDB(connection: Connection, enviroment: EnvironmentService) {
    const sql = fs.readFileSync(path.join(__dirname, `../db/${enviroment.appVersion}_postgres.sql`)).toString();
    if (sql) {
        await connection.manager.query(sql);
    }
}

const env = new EnvironmentService();
InstallUtils.tryCreateDbConnection(env, 10).then((connection: Connection) => {
    install(connection, env).then(() => {
        exitOk();
    }).catch((err) => {
        exitErr(err);
    });
}).catch((err) => {
    exitErr(err);
});
