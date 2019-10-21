import { Controller, UseGuards, Get, Param } from "@nestjs/common";
import { StockDataService } from "./stock-data.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";

@Controller("stock-data")
export class StockDataController {

    constructor(
        private stockData: StockDataService,
    ) { }

    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @Get()
    public async getAllPx() {
        return await this.stockData.getAll();
    }

    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @Get(":symbol")
    @ApiImplicitParam({ name: "symbol" })
    public async getSymbolPx(@Bearer() token: string, @Param("symbol") symbol: any) {
        return await this.stockData.getSymbolPx(symbol);
    }

    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @Get("/history/:symbol")
    @ApiImplicitParam({ name: "symbol" })
    public async getSymbolAllPx(@Bearer() token: string, @Param("symbol") symbol: any) {
        return await this.stockData.getSymbolAllPx(symbol);
    }

}
