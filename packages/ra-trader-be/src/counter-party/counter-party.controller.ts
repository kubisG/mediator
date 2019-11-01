import { Controller, UseGuards, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { RolesGuard } from "@ra/web-auth-be/dist/guards/roles.guard";
import { CounterPartyService } from "./counter-party.service";
import { Roles } from "@ra/web-auth-be/dist/decorators/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { CounterPartyDto } from "./dto/counter-party.dto";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger/dist";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";

@Controller("counter-party")
export class CounterPartyController {

    constructor(
        private counterPartyService: CounterPartyService,
    ) { }

    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @Get()
    getAdminCounterParties(@Bearer() token: string) {
        return this.counterPartyService.getCounterParties(token);
    }

    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @Get("/type/:type")
    @ApiImplicitParam({ name: "type" })
    getCounterParties(@Bearer() token: string, @Param("type") type) {
        return this.counterPartyService.getCounterParties(token, type);
    }

    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @Get("/:id")
    @ApiImplicitParam({ name: "id" })
    getCounterParty(@Bearer() token: string, @Param("id") id) {
        return this.counterPartyService.findOne(id, token);
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles("MANAGER", "ADMIN")
    @Post()
    saveCounterParty(@Bearer() token: string, @Body() data: CounterPartyDto) {
        return this.counterPartyService.save(data, token);
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles("MANAGER", "ADMIN")
    @Delete("/:id")
    @ApiImplicitParam({ name: "id" })
    removeCounterParty(@Bearer() token: string, @Param("id") id) {
        return this.counterPartyService.delete(id, token);
    }
}
