import { Injectable, Inject } from "@nestjs/common";
import { Connection } from "typeorm";
import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import axios from "axios";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { OrderStoreRepository } from "../../dao/repositories/order-store.repository";
import { RaStock } from "../../entity/ra-stock";
import { RaCurrency } from "../../entity/ra-currency";
import { RaPreference } from "../../entity/ra-preference";

@Injectable()
export class DownloadService {

    constructor(
        @Inject("orderStoreRepository") private raOrderStore: OrderStoreRepository,
        @Inject("DbConnection") private dbConnection: () => Connection,
        private env: EnvironmentService,
        @Inject("logger") private logger: Logger,
    ) { }

    private sleepme(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    private async getData() {

        const symbols = await this.dbConnection().
            getRepository(RaStock).query("select distinct value from ra_input_rules where label='Symbol'");

        for (let j = 0; j < symbols.length; j++) {
            const symbol = symbols[j].value;
            let url = this.env.stockDataService.baseUrl + "&apikey=" + this.env.stockDataService.apiKey;
            url = url + "&symbol=" + symbol;

            if ((j % 4) === 1) {
                this.logger.silly(`sleeping 40`);
                await this.sleepme(40000);
            }
            this.logger.silly(`DOWNLOADING ${url}`);

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
                    await this.insertToDB(raStock);
                    // take only 10 days back
                    if (i > 10) {
                        break;
                    }
                }
            }
        }


        const currencies = await this.dbConnection().getRepository(RaCurrency)
            .query("select distinct upper(value) val from ra_input_rules where label='Currency'");

        const currArray = ["USD", "GBP", "EUR"];

        for (let i = 0; i < currArray.length; i++) {
            const val = {};
            for (let j = 0; j < currencies.length; j++) {
                const currency = currencies[j].val;
                let url = this.env.stockDataService.currUrl + "&apikey=" + this.env.stockDataService.apiKey;
                url = url + "&from_currency=" + currArray[i] + "&to_currency=" + currency;

                if ((j % 4) === 1) {
                    this.logger.silly(`sleeping 40`);
                    await this.sleepme(40000);
                }
                this.logger.silly(`DOWNLOADING ${url}`);

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
                    await this.insertToCurrDB(raCurrency);
                    val[currency] = price;
                }
            }
            const raPreference = new RaPreference();
            raPreference.name = currArray[i] + "_transfers";
            raPreference.userId = 0;
            raPreference.companyId = 0;
            raPreference.value = JSON.stringify(val);
            await this.insertToPrefDB(raPreference);
        }
    }

    private async insertToPrefDB(raPreference: RaPreference) {
        try {
            const select = await this.dbConnection().getRepository(RaPreference).findOne({
                name: raPreference.name, userId: raPreference.userId
                , companyId: raPreference.companyId
            });
            if (select) {
                await this.dbConnection().getRepository(RaPreference).update({
                    name: raPreference.name, userId: raPreference.userId
                    , companyId: raPreference.companyId
                }, raPreference);
            } else {
                await this.dbConnection().getRepository(RaPreference).insert(raPreference);
            }
        } catch (e) {
            this.logger.error(e);
        } finally {
        }
    }

    private async insertToCurrDB(raCurrency: RaCurrency) {
        try {
            const select = await this.dbConnection().getRepository(RaCurrency).findOne({ from: raCurrency.from, to: raCurrency.to });
            if (select) {
                await this.dbConnection().getRepository(RaCurrency).update({ id: select.id }, raCurrency);
            } else {
                await this.dbConnection().getRepository(RaCurrency).insert(raCurrency);
            }
        } catch (e) {
            this.logger.error(e);
        } finally {
        }
    }

    private async insertToDB(raStock: RaStock) {
        try {
            const select = await this.dbConnection().getRepository(RaStock).findOne(
                { symbol: raStock.symbol, priceDate: raStock.priceDate });
            if (select) {
                await this.dbConnection().getRepository(RaStock).update({ id: select.id }, raStock);
            } else {
                await this.dbConnection().getRepository(RaStock).insert(raStock);
            }
        } catch (e) {
            this.logger.error(e);
        } finally {
        }
    }

    public async downloadData(data) {
        this.logger.info(`START DATA DOWNLOADING ${data}`);
        try {
            await this.getData();
        } catch (e) {
            this.logger.error(e);
        } finally {
        }
        this.logger.info(`FINISHED DATA DOWNLOADING ${data}`);
        return {};
    }
}
