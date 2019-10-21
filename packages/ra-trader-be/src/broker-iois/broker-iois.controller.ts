import { Controller, UseGuards, Get, Param, Put, Body, Post, Delete } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";
import { BrokerIoisService } from "./broker-iois.service";
import { IoisDto } from "../messages/dto/iois.dto";

@Controller("broker/iois")
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class BrokerIoisController {

    constructor(
        private ioisService: BrokerIoisService,
    ) { }

    @Get("/all/:dates/:filter")
    @ApiImplicitParam({ name: "filter" })
    @ApiImplicitParam({ name: "dates" })
    getIois(@Param("filter") filter: string, @Param("dates") dates: string, @Bearer() token: string) {
        return this.ioisService.getIois(token, dates);
    }

    @Put(":id")
    @ApiImplicitParam({ name: "id" })
    update(@Bearer() token: string, @Param("id") id, @Body() ioisDto: IoisDto) {
        return this.ioisService.update(id, ioisDto, token);
    }

    @Post(":id")
    @ApiImplicitParam({ name: "id" })
    insert(@Bearer() token: string, @Body() ioisDto: IoisDto) {
        return this.ioisService.insert(ioisDto, token);
    }

    @Get(":id")
    @ApiImplicitParam({ name: "id" })
    findOne(@Param("id") id) {
        return this.ioisService.findOne(id);
    }

    @Delete(":id")
    @ApiImplicitParam({ name: "id" })
    deleteOne(@Bearer() token: string, @Param("id") id) {
        return this.ioisService.delete(id, token);
    }

    @Get("/raId/:id")
    @ApiImplicitParam({ name: "id" })
    findRaidIois(@Param("id") id) {
        return this.ioisService.findRaidIois(id);
    }

}
