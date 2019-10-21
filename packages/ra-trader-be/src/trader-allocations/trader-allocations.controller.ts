import { Controller, UseGuards, Get, Param, Put, Body, Post, Delete } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";
import { TraderAllocationsService } from "./trader-allocations.service";
import { AllocationsDto } from "../messages/dto/allocations.dto";

@Controller("allocations")
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class TraderAllocationsController {

    constructor(
        private allocationsService: TraderAllocationsService,
    ) { }

    @Post("/all/:filter")
    @ApiImplicitParam({ name: "filter" })
    getAllocations(@Body() filter: any, @Bearer() token: string) {
        return this.allocationsService.getAllocations(token, filter.dates, filter.showComp, filter.showAllMsg);
    }

    @Put(":id")
    @ApiImplicitParam({ name: "id" })
    update(@Bearer() token: string, @Param("id") id, @Body() allocationsDto: AllocationsDto) {
        return this.allocationsService.update(id, allocationsDto, token);
    }

    @Post(":id")
    @ApiImplicitParam({ name: "id" })
    insert(@Bearer() token: string, @Body() allocationsDto: AllocationsDto) {
        return this.allocationsService.insert(allocationsDto, token);
    }

    @Get(":id")
    @ApiImplicitParam({ name: "id" })
    findOne(@Param("id") id) {
        return this.allocationsService.findOne(id);
    }

    @Delete(":id")
    @ApiImplicitParam({ name: "id" })
    deleteOne(@Bearer() token: string, @Param("id") id) {
        return this.allocationsService.delete(id, token);
    }

    @Delete("/raId/:id")
    @ApiImplicitParam({ name: "id" })
    deleteRaidAlloc(@Bearer() token: string, @Param("id") id) {
        return this.allocationsService.deleteRaidAlloc(id, token);
    }

    @Get("/raId/:id")
    @ApiImplicitParam({ name: "id" })
    findRaidAlloc(@Bearer() token: string, @Param("id") id) {
        return this.allocationsService.findRaidAlloc(id, token);
    }

}
