import { Injectable, Inject } from "@nestjs/common";


import { EnvironmentService } from "@ra/web-env-be/dist/environment.service";
import { Logger } from "@ra/web-core-be/dist/logger/providers/logger";
import { StockDataRepository } from "../dao/repositories/stock-data.repository";
import { RaStock } from "../entity/ra-stock";

@Injectable()
export class StockDataService {

    constructor(
        private env: EnvironmentService,
        @Inject("logger") private logger: Logger,
        @Inject("stockRepository") private stockRep: StockDataRepository,
    ) { }


    async getAll(): Promise<RaStock[]> {
        return await this.stockRep.createQueryBuilder()
            .select("symbol")
            .addSelect("max(\"priceDate\") AS \"priceDate\"")
            .groupBy("symbol")
            .getRawMany();
    }

    async getSymbolPx(symbol: any): Promise<RaStock[]> {
        return await this.stockRep.find({
            where: { symbol: symbol },
            order: {
                priceDate: "DESC"
            },
            take: 1
        });
    }

    async getSymbolAllPx(symbol: any): Promise<RaStock[]> {
        return await this.stockRep.find({
            where: { symbol: symbol },
            order: {
                priceDate: "DESC"
            }
        });
    }
}
