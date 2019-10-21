import { Controller, UseGuards, Get, Param, Post, Body, Inject } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger";
import { TraderService } from "./trader.service";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";
import { OrdersDto } from "../messages/dto/orders.dto";
import { FilterDto } from "../messages/dto/filter.dto";


@Controller("trader")
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class TraderController {

    constructor(
        @Inject("traderOrderService") private traderService: TraderService
    ) { }

    @Get("/fills")
    public async getNewMessages(@Bearer() token: string) {
        return await this.traderService.getNewMessages(token);
    }

    @Post("/all/")
    public async getOrders(
        @Bearer() token: string, @Body() filters: FilterDto
    ) {
        const app = filters["app"];
        const dates = filters["date"];
        const compOrders = filters["comp"];
        const gtcGtd = filters["gtcGtd"];
        const clOrdLinkID = filters["clOrdLinkID"];
        const isPhone = filters["isPhone"];
        // TODO
        return await this.traderService.getOrders(app, dates, token, compOrders, gtcGtd, clOrdLinkID, isPhone);
    }

    @Get("/messages/:raID")
    @ApiImplicitParam({ name: "raID" })
    public async getMessages(@Bearer() token: string, @Param("raID") raID: any) {
        return await this.traderService.getParsedMessagesTrader(token, raID);
    }

    @Get("/order/:raID")
    @ApiImplicitParam({ name: "raID" })
    public async getOrder(@Bearer() token: string, @Param("raID") raID: any) {
        return await this.traderService.getParsedOrderTrader(token, raID);
    }

    @Get("/childsQty/:clOrdLinkID")
    @ApiImplicitParam({ name: "clOrdLinkID" })
    public async getChildsQty(@Bearer() token: string, @Param("clOrdLinkID") clOrdLinkID: any) {
        return await this.traderService.getChildsQty(token, clOrdLinkID);
    }


    @Post()
    public sendMessage(@Bearer() token: string, @Body() order: OrdersDto) {
        return this.traderService.sendMsg(order, token);
    }

    @Post("/response")
    public async getResponse(@Bearer() token: string, @Body() order: OrdersDto) {
        return this.traderService.getMessageResponse(token, order);
    }

    @Get("/trades/:symbol/:currency")
    @ApiImplicitParam({ name: "symbol" })
    @ApiImplicitParam({ name: "currency" })
    public async getTrades(@Bearer() token: string, @Param("symbol") symbol: any, @Param("currency") currency: any) {
        return await this.traderService.getMessagesTrader(token, null, symbol, currency);
    }

    @Get("/clients")
    public async getClients(@Bearer() token: string) {
        return await this.traderService.getClients(token);
    }
}
