import { Body, Controller, Get, Post, UseGuards, Put, Param } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { SleuthService } from "./sleuth.service";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger";


@Controller("sleuth")
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class SleuthController {

    constructor(
        private readonly sleuthService: SleuthService,
    ) { }


    @Get("/:side/:symbol")
    @ApiImplicitParam({ name: "side" })
    @ApiImplicitParam({ name: "symbol" })
    public getSleuthData(@Bearer() token: string, @Param("side") side, @Param("symbol") symbol) {
        return this.sleuthService.getSleuthData(token, side, symbol);
    }
}
