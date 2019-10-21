import { Controller, UseGuards, Get, Param, Put, Body, Post, Delete } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";
import { BrokerAllocationsService } from "./broker-allocations.service";

@Controller("broker-allocations")
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class BrokerAllocationsController {

    constructor(
        private allocationsService: BrokerAllocationsService,
    ) { }

    @Get("/all/:dates")
    @ApiImplicitParam({ name: "dates" })
    getAllocations(@Param("dates") dates: string, @Bearer() token: string) {
        return this.allocationsService.getAllocations(token, dates, null, null);
    }

    @Get(":id")
    @ApiImplicitParam({ name: "id" })
    findOne(@Param("id") id) {
        return this.allocationsService.findOne(id);
    }
}
