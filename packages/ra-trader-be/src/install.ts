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
import { RaAccounts } from "./entity/ra-accounts";
import { RaInputRelations } from "./entity/ra-input-relations";

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
        entities,
        synchronize: true,
        logging: true,
    } as PostgresConnectionOptions);
}

async function insertToDB(connection: Connection) {
    const userJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../db/ra_user.json"), "utf-8"));
    const comapanyJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../db/ra_company.json"), "utf-8"));
    const inputRulesJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../db/ra_input_rules.json"), "utf-8"));
    const inputRelationsJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../db/ra_input_relations.json"), "utf-8"));
    const preferenceJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../db/ra_preference.json"), "utf-8"));
    const accountsJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../db/ra_accounts.json"), "utf-8"));

    const raUser = connection.getRepository(RaUser);
    const raCompany = connection.getRepository(RaCompany);
    const raPreference = connection.getRepository(RaPreference);
    const raInputRules = connection.getRepository(RaInputRules);
    const raInputRelations = connection.getRepository(RaInputRelations);
    const raAccounts = connection.getRepository(RaAccounts);

    // select * from ra_company where id=1;
    for (const json of comapanyJson) {
        const exists = await raCompany.find({ id: json.id });
        if (exists.length === 0) {
            const params = [];
            const values = [];
            let j = 1;
            for (const key in json) {
                if (json[key] !== undefined) {
                    params.push("$" + j);
                    values.push(json[key]);
                    j += 1;
                }
            }
            // SELECT setval('payments_id_seq', 21, true);
            await connection.manager.query(
                `INSERT INTO ra_company ("${Object.keys(json).join("\",\"")}") VALUES (${params.join(",")})`,
                values,
            );
        }
    }
    await connection.manager.query("SELECT setval('ra_company_id_seq', COALESCE((SELECT MAX(id)+1 FROM ra_company), 1), true);");

    // select * from ra_user where id=13;
    for (const json of userJson) {
        const exists = await raUser.find({ id: json.id });
        if (exists.length === 0) {
            const params = [];
            const values = [];
            let j = 1;
            for (const key in json) {
                if (json[key] !== undefined) {
                    params.push("$" + j);
                    values.push(json[key]);
                    j += 1;
                }
            }
            await connection.manager.query(
                `INSERT INTO ra_user ("${Object.keys(json).join("\",\"")}") VALUES (${params.join(",")})`,
                values,
            );
        }
    }
    await connection.manager.query("SELECT setval('ra_user_id_seq', COALESCE((SELECT MAX(id)+1 FROM ra_user), 1), true);");

    // select id,"parentId","rootId",label,name,value,0 "companyId" from ra_input_rules
    // where ("companyId"=0 and label
    // in ('CommType', 'ExecInst','ExecType','OrderCapacity','Side','OrdStatus','TimeInForce'
    // ,'OrdType','Reject','AllocRejCode','LastLiquidityInd','LastCapacity')) or
    // ( "companyId"=1 and label in ('Symbol','SecurityDesc','SecurityID','SecurityIDSource') and id>600)
    // or ( "companyId"=8 and label in ('ExDestination'))
    // or ("companyId"=0 and label in ('Currency') and id>90 and "parentId" is null);
    for (const json of inputRulesJson) {
        const exists = await raInputRules.find({ id: json.id });
        if (exists.length === 0) {
            const params = [];
            const values = [];
            let j = 1;
            for (const key in json) {
                if (json[key] !== undefined) {
                    params.push("$" + j);
                    values.push(json[key]);
                    j += 1;
                }
            }
            await connection.manager.query(
                `INSERT INTO ra_input_rules ("${Object.keys(json).join("\",\"")}") VALUES (${params.join(",")})`,
                values,
            );
        }
    }
    await connection.manager.query("SELECT setval('ra_input_rules_id_seq', COALESCE((SELECT MAX(id)+1 FROM ra_input_rules), 1), true);");

    for (const json of inputRelationsJson) {
        const exists = await raInputRelations.find({ relid: json.relid });
        if (exists.length === 0) {
            const params = [];
            const values = [];
            let j = 1;
            for (const key in json) {
                if (json[key] !== undefined) {
                    params.push("$" + j);
                    values.push(json[key]);
                    j += 1;
                }
            }
            await connection.manager.query(
                `INSERT INTO ra_input_relations ("${Object.keys(json).join("\",\"")}") VALUES (${params.join(",")})`,
                values,
            );
        }
    }
    await connection.manager.query(
        "SELECT setval('ra_input_relations_id_seq', COALESCE((SELECT MAX(id)+1 FROM ra_input_relations), 1), true);");

    // select * from ra_preference where name in ('order_store_lists', 'portfolio_columns','eikon',
    // 'messageFilters','portfolio_sum_columns','app','portfolio_detail_columns','allocations_columns','init.params',
    // 'broker_store_columns','order_store_columns','brokeralloc_columns');
    for (const json of preferenceJson) {
        const exists = await raPreference.find({ name: json.name, userId: json.userId });
        if (exists.length === 0) {
            const params = [];
            const values = [];
            let j = 1;
            for (const key in json) {
                if (json[key] !== undefined) {
                    params.push("$" + j);
                    values.push(json[key]);
                    j += 1;
                }
            }
            await connection.manager.query(
                `INSERT INTO ra_preference ("${Object.keys(json).join("\",\"")}") VALUES (${params.join(",")})`,
                values,
            );
        }
    }
    // await connection.manager.query("SELECT setval('ra_preference_id_seq', 1000, true);");

    // select * from ra_accounts where "companyId" = 1;
    for (const json of accountsJson) {
        const exists = await raAccounts.find({ id: json.id });
        if (exists.length === 0) {
            const params = [];
            const values = [];
            let j = 1;
            for (const key in json) {
                if (json[key] !== undefined) {
                    params.push("$" + j);
                    values.push(json[key]);
                    j += 1;
                }
            }
            await connection.manager.query(
                `INSERT INTO ra_accounts ("${Object.keys(json).join("\",\"")}") VALUES (${params.join(",")})`,
                values,
            );
        }
    }
    await connection.manager.query("SELECT setval('ra_accounts_id_seq', COALESCE((SELECT MAX(id)+1 FROM ra_accounts), 1), true);");

}

async function afterInsertToDB(connection: Connection) {
    const sql = fs.readFileSync(path.join(__dirname, "../db/after-db.sql")).toString();
    await connection.manager.query(sql);
}

async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function exportData(connection: Connection) {

    const raUser = connection.getRepository(RaUser);
    const raCompany = connection.getRepository(RaCompany);
    const raPreference = connection.getRepository(RaPreference);
    const raInputRules = connection.getRepository(RaInputRules);
    const raInputRelations = connection.getRepository(RaInputRelations);

    const users = await raUser.find();
    const company = await raCompany.find();
    const preference = await raPreference.find({
        userId: 0,
        companyId: 0,
    });
    const inputRules = await raInputRules.find();
    const inputRelations =  await raInputRelations.find();
    try {
        fs.unlinkSync(path.join(__dirname, "../db/ra_user.json"));
        fs.unlinkSync(path.join(__dirname, "../db/ra_company.json"));
        fs.unlinkSync(path.join(__dirname, "../db/ra_input_rules.json"));
        fs.unlinkSync(path.join(__dirname, "../db/ra_input_relations.json"));
        fs.unlinkSync(path.join(__dirname, "../db/ra_preference.json"));
    } catch (err) {
        console.log(err);
    }

    fs.writeFileSync(path.join(__dirname, "../db/ra_user.json"), JSON.stringify(users), "utf8");
    fs.writeFileSync(path.join(__dirname, "../db/ra_company.json"), JSON.stringify(company), "utf8");
    fs.writeFileSync(path.join(__dirname, "../db/ra_input_rules.json"), JSON.stringify(inputRules), "utf8");
    fs.writeFileSync(path.join(__dirname, "../db/ra_input_relations.json"), JSON.stringify(inputRelations), "utf8");
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

async function auditTables(connection: Connection) {
    const sql = fs.readFileSync(path.join(__dirname, "../db/postgres.sql")).toString();
    await connection.manager.query(sql);
}

async function updateToDB(connection: Connection) {
    const sql = fs.readFileSync(path.join(__dirname, "../db/update-db.sql")).toString();
    await connection.manager.query(sql);
}

async function install() {
    const env = new EnvironmentService();
    const result = await waitForDb(env);
    if (!result) {
        console.log("DATABASE: FAIL TO CONNECT");
        process.exit(1);
    }
    let connection;
    try {
        connection = await getConnection(new EnvironmentService());
        //    await auditTables(connection);
        await insertToDB(connection);
        //    await afterInsertToDB(connection);
        await updateToDB(connection);
    } catch (e) {
        console.error(e);
    } finally {
        if (connection) {
            connection.close();
        }
    }
    process.exit(0);
}

dotenv.config();
install();
