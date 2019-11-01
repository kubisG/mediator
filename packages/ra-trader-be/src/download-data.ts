import { Connection, createConnection } from "typeorm";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import * as dotenv from "dotenv";
import axios from "axios";
import { entities } from "./entity/entities";
import { RaStock } from "./entity/ra-stock";
import { RaCurrency } from "./entity/ra-currency";
import { RaPreference } from "./entity/ra-preference";

async function getConnection(env: EnvironmentService): Promise<Connection> {
    return await createConnection({
        name: "stockData",
        type: env.db.type,
        schema: env.db.schema,
        host: env.db.host,
        port: env.db.port,
        username: env.db.user,
        password: env.db.password,
        database: env.db.db,
        entities,
        synchronize: true,
        logging: env.logging.db,
    } as PostgresConnectionOptions);
}

function sleepme(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function getData(connection: Connection, env: EnvironmentService) {

    const symbols = await connection.getRepository(RaStock).query("select distinct value from ra_input_rules where label='Symbol'");

    for (let j = 0; j < symbols.length; j++) {
        const symbol = symbols[j].value;
        let url = env.stockDataService.baseUrl + "&apikey=" + env.stockDataService.apiKey;
        url = url + "&symbol=" + symbol;

        if ((j % 5) === 1) {
            console.log("sleeping 60");
            await sleepme(60000);
        }
        console.log(url);
        const response = await axios.get(url);
        let myDate = null;
        let open = 0;
        let close = 0;
        let high = 0;
        let low = 0;
        let volume = 0;
        if ((response.data) && (response.data["Time Series (Daily)"])) {
            const keys = Object.keys(response.data["Time Series (Daily)"]);
            for (let i = 0; i < keys.length; i++) {
                myDate = keys[i];
                const raStock = new RaStock();
                open = Number(response.data["Time Series (Daily)"][myDate]["1. open"]);
                high = Number(response.data["Time Series (Daily)"][myDate]["2. high"]);
                low = Number(response.data["Time Series (Daily)"][myDate]["3. low"]);
                close = Number(response.data["Time Series (Daily)"][myDate]["4. close"]);
                volume = Number(response.data["Time Series (Daily)"][myDate]["5. volume"]);
                raStock.symbol = symbol;
                raStock.startPx = open;
                raStock.highPx = high;
                raStock.lowPx = low;
                raStock.lastPx = close;
                raStock.volume = volume;
                raStock.priceDate = new Date(myDate);
                await insertToDB(connection, raStock);
                // take only 10 days back
                if (i > 10) {
                    break;
                }
            }
        }
    }

    const currencies = await connection.getRepository(RaCurrency)
        .query("select distinct upper(value) val from ra_input_rules where label='Currency'");

    const currArray = ["USD", "GBP", "EUR"];

    for (let i = 0; i < currArray.length; i++) {
        const val = {};
        for (let j = 0; j < currencies.length; j++) {
            const currency = currencies[j].val;
            let url = env.stockDataService.currUrl + "&apikey=" + env.stockDataService.apiKey;
            url = url + "&from_currency=" + currArray[i] + "&to_currency=" + currency;

            if ((j % 5) === 1) {
                console.log("sleeping 60");
                await sleepme(60000);
            }
            console.log(url);
            const response = await axios.get(url);
            let myDate = null;
            let price = 0;
            if ((response.data) && (response.data["Realtime Currency Exchange Rate"])) {
                const raCurrency = new RaCurrency();
                price = Number(response.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);
                myDate = response.data["Realtime Currency Exchange Rate"]["6. Last Refreshed"];
                raCurrency.from = currArray[i];
                raCurrency.to = currency;
                raCurrency.price = price;
                raCurrency.date = new Date(myDate);
                await insertToCurrDB(connection, raCurrency);
                val[currency] = price;
            }
        }
        const raPreference = new RaPreference();
        raPreference.name = currArray[i] + "_transfers";
        raPreference.userId = 0;
        raPreference.companyId = 0;
        raPreference.value = JSON.stringify(val);
        await insertToPrefDB(connection, raPreference);
    }
}

async function insertToPrefDB(connection: Connection,
                              raPreference: RaPreference) {
    try {
        const select = await connection.getRepository(RaPreference).findOne({
            name: raPreference.name, userId: raPreference.userId
            , companyId: raPreference.companyId,
        });
        if (select) {
            await connection.getRepository(RaPreference).update({
                name: raPreference.name, userId: raPreference.userId
                , companyId: raPreference.companyId,
            }, raPreference);
        } else {
            await connection.getRepository(RaPreference).insert(raPreference);
        }
    } catch (e) {
        console.log(e);
    } finally {
    }
}

async function insertToCurrDB(connection: Connection,
                              raCurrency: RaCurrency) {
    try {
        const select = await connection.getRepository(RaCurrency).findOne({ from: raCurrency.from, to: raCurrency.to });
        if (select) {
            await connection.getRepository(RaCurrency).update({ id: select.id }, raCurrency);
        } else {
            await connection.getRepository(RaCurrency).insert(raCurrency);
        }
    } catch (e) {
        console.log(e);
    } finally {
    }
}

async function insertToDB(connection: Connection,
                          raStock: RaStock) {
    try {
        const select = await connection.getRepository(RaStock).findOne({ symbol: raStock.symbol, priceDate: raStock.priceDate });
        if (select) {
            await connection.getRepository(RaStock).update({ id: select.id }, raStock);
        } else {
            await connection.getRepository(RaStock).insert(raStock);
        }
    } catch (e) {
        console.log(e);
    } finally {
    }
}

async function downloadData() {
    let connection;
    try {
        const env = new EnvironmentService();
        connection = await getConnection(env);
        await getData(connection, env);
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
downloadData();
