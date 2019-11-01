import { Controller, UseGuards, Get, Param, Post, Body, Inject } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger";
import { BrokerService } from "./broker.service";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";
import { OrdersDto } from "../messages/dto/orders.dto";
import { FilterDto } from "../messages/dto/filter.dto";

@Controller("broker")
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class BrokerController {

    constructor(
        @Inject("brokerOrderService") private brokerService: BrokerService,
    ) { }

    @Get("/fills")
    public async getNewMessages(@Bearer() token: string) {
        return await this.brokerService.getNewMessages(token);
    }

    @Post("/all/")
    public async getOrders(
        @Bearer() token: string, @Body() filters: FilterDto,
    ) {
        const app = filters["app"];
        const dates = filters["date"];
        const compOrders = filters["comp"];
        const gtcGtd = filters["gtcGtd"];
        // TODO
        return await this.brokerService.getOrders(app, dates, token, compOrders, gtcGtd);
    }

    @Get("/messages/:raID")
    @ApiImplicitParam({ name: "raID" })
    public async getMessages(@Bearer() token: string, @Param("raID") raID: any) {
        return await this.brokerService.getParsedMessagesBroker(token, raID);
    }

    @Get("/order/:raID")
    @ApiImplicitParam({ name: "raID" })
    public async getOrder(@Bearer() token: string, @Param("raID") raID: any) {
        return await this.brokerService.getParsedOrderBroker(token, raID);
    }

    @Post()
    public sendMessage(@Bearer() token: string, @Body() order: OrdersDto) {
        return this.brokerService.sendMsg(order, token);
    }

    @Post("/response")
    public async getResponse(@Bearer() token: string, @Body() order: OrdersDto) {
        return this.brokerService.getMessageResponse(token, order);
    }

    @Get("/childsQty/:clOrdLinkID")
    @ApiImplicitParam({ name: "clOrdLinkID" })
    public async getChildsQty(@Bearer() token: string, @Param("clOrdLinkID") clOrdLinkID: any) {
        return await this.brokerService.getChildsQty(token, clOrdLinkID);
    }

    @Get("/childsPrice/:clOrdLinkID/:side")
    @ApiImplicitParam({ name: "clOrdLinkID" })
    public async getChildsPrice(@Bearer() token: string, @Param("clOrdLinkID") clOrdLinkID: any, @Param("side") side: any) {
        return await this.brokerService.getChildsPrice(token, clOrdLinkID, side);
    }

    @Get("/trades/:symbol/:currency")
    @ApiImplicitParam({ name: "symbol" })
    @ApiImplicitParam({ name: "currency" })
    public async geTrades(@Bearer() token: string, @Param("symbol") symbol: any, @Param("currency") currency: any) {
        return await this.brokerService.getMessagesBroker(token, null, symbol, currency);
    }

    @Get("/clients")
    public async getClients(@Bearer() token: string) {
        return await this.brokerService.getClients(token);
    }
}
