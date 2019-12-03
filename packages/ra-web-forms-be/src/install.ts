import { AppModule } from "./app.module";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { Connection } from "typeorm";
import { InstallUtils } from "@ra/web-core-be/dist/install/install-utils";
import { INestApplication } from "@nestjs/common";

import * as dotenv from "dotenv";
import * as fs from "fs";
import * as _ from "lodash";

dotenv.config();

function exitErr(err: any) {
    console.log("ERR", err);
    process.exit(1);
}

function exitOk() {
    process.exit(0);
}

async function isAdminInitialized(connection: Connection): Promise<boolean> {
    const adminMail = process.env.ADMIN_EMAIL_ADDRESS;
    const findQuery = `select \"email\" from ra_user where \"email\"='${adminMail}'`;
    const result = await connection.manager.query(findQuery);
    return !_.isEmpty(result);
}

async function isCompanyInitialized(connection: Connection): Promise<boolean> {
    const companyMail = process.env.COMPANY_EMAIL_ADDRESS;
    const findQuery = `select \"companyMail\" from ra_company where \"companyMail\"='${companyMail}'`;
    const result = await connection.manager.query(findQuery);
    return !_.isEmpty(result);
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
    const mail = process.env.ADMIN_EMAIL_ADDRESS;
    const company = process.env.COMPANY_EMAIL_ADDRESS;
    const updateAdminQuery = `update ra_user set \"username\"='${mail}',\"email\"='${mail}'`;
    const updateCompanyQuery = `update ra_company set \"companyName\"='${company}',\"companyMail\"='${mail}'`;
    const adminInitialized = await isAdminInitialized(connection);
    const companyInitialized = await isCompanyInitialized(connection);

    let sql = fs.readFileSync("./db/01_postgres.sql").toString();
    await connection.manager.query(sql);
    sql = fs.readFileSync("./db/2.0.1_postgres.sql").toString();
    await connection.manager.query(sql);

    // update default user and default company only once
    // during update have to be present only one company and one user (default ones)
    if (!adminInitialized && !companyInitialized) {
        try {
            await connection.manager.query(updateAdminQuery);
            await connection.manager.query(updateCompanyQuery);
        } catch (ex) {
            console.error("More then one user exists", ex);
        }
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
