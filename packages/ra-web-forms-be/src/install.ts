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

async function install(connection: Connection) {
    await connection.close();
    process.env.DB_SYNCH = "true";
    process.env.DB_LOGGING = "true";
    const app: INestApplication = await InstallUtils.initDbFromModule(AppModule);
    const newConnection = app.get("DbConnection");
    await afterInsertToDB(newConnection());
    app.close();
}

async function afterInsertToDB(connection: Connection) {
    let sql = fs.readFileSync("./db/01_postgres.sql").toString();
    await connection.manager.query(sql);
    sql = fs.readFileSync("./db/2.0.1_postgres.sql").toString();
    await connection.manager.query(sql);

    const mail = process.env.ADMIN_MAIL;
    const company = process.env.ADMIN_COMPANY;
    try {
        sql = `update ra_company set \"companyName\"='${company}',\"companyMail\"='${mail}'`;
        await connection.manager.query(sql);
        sql = `update ra_user set \"username\"='${mail}',\"email\"='${mail}'`;
        await connection.manager.query(sql);
    } catch (ex) {
        console.log("More then one user exists");
    }

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
