import { Connection, createConnection } from "typeorm";
import * as path from "path";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as net from "net";
import { entities } from "./entity/entities";
import { RaUser } from "./entity/ra-user";
import { RaCompany } from "./entity/ra-company";
import { RaPreference } from "./entity/ra-preference";
import { RaInputRules } from "./entity/ra-input-rules";

async function getConnection(env: EnvironmentService): Promise<Connection> {
    return await createConnection({
        name: "install",
        type: env.db.type,
        schema: env.db.schema,
        host: env.db.host,
        port: env.db.port,
        username: env.db.user,
        password: env.db.password,
        database: env.db.db,
        entities: entities,
        synchronize: true,
        logging: env.logging.db,
    } as PostgresConnectionOptions);
}

async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function exportData(connection: Connection) {

    const raUser = connection.getRepository(RaUser);
    const raCompany = connection.getRepository(RaCompany);
    const raPreference = connection.getRepository(RaPreference);
    const raInputRules = connection.getRepository(RaInputRules);

    const users = await raUser.find();
    const company = await raCompany.find();
    const preference = await raPreference.find({
        userId: 0,
        companyId: 0,
    });
    const inputRules = await raInputRules.find();

    fs.unlinkSync(path.join(__dirname, "../db/ra_user.json"));
    fs.unlinkSync(path.join(__dirname, "../db/ra_company.json"));
    fs.unlinkSync(path.join(__dirname, "../db/ra_input_rules.json"));
    fs.unlinkSync(path.join(__dirname, "../db/ra_preference.json"));

    fs.writeFileSync(path.join(__dirname, "../db/ra_user.json"), JSON.stringify(users), "utf8");
    fs.writeFileSync(path.join(__dirname, "../db/ra_company.json"), JSON.stringify(company), "utf8");
    fs.writeFileSync(path.join(__dirname, "../db/ra_input_rules.json"), JSON.stringify(inputRules), "utf8");
    fs.writeFileSync(path.join(__dirname, "../db/ra_preference.json"), JSON.stringify(preference), "utf8");
}

async function testConnection(port: number, host: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        const socket = net.connect(port, host, () => { });
        socket.on("connect", () => {
            socket.destroy();
            resolve(true);
        });
        socket.on("error", () => {
            socket.destroy();
            resolve(false);
        });
        socket.on("timeout", () => {
            socket.destroy();
            resolve(false);
        });
    });
}

async function waitForDb(env: EnvironmentService) {
    while (true) {
        const result = await testConnection(env.db.port, env.db.host);
        if (result) {
            console.log("DATABASE: UP");
            return true;
        } else {
            console.log("DATABASE: TRY AGAIN");
            await timeout(1000);
        }
    }
}

async function install() {
    const env = new EnvironmentService();
    const result = await waitForDb(env);
    if (!result) {
        console.log("DATABASE: FAIL TO CONNECT");
        process.exit();
    }
    let connection;
    try {
        connection = await getConnection(new EnvironmentService());
        await exportData(connection);
    } catch (e) {
        console.error(e);
    } finally {
        if (connection) {
            connection.close();
        }
    }
    process.exit();
}

dotenv.config();
install();
