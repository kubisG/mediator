import { Body, Controller, Get, UseGuards, Param, Put } from "@nestjs/common";

import { PortfolioDto } from "./dto/portfolio.dto";
import { PortfolioService } from "./portfolio.service";
import { AuthGuard } from "@nestjs/passport";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger/dist";


@Controller("portfolio")
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class PortfolioController {

    constructor(
        private readonly portfolioService: PortfolioService,
    ) { }

    @Get("company")
    findCompanyAll(@Bearer() token: string) {
        return this.portfolioService.findAndCount(token, true);
    }

    @Put(":id")
    @ApiImplicitParam({ name: "id" })
    update(@Bearer() token: string, @Param("id") id, @Body() portfolioDto: PortfolioDto) {
        return this.portfolioService.update(id, portfolioDto, token);
    }

    @Get(":id")
    @ApiImplicitParam({ name: "id" })
    findOne(@Param("id") id) {
        return this.portfolioService.findOne(id);
    }

    @Get()
    findAll(@Bearer() token: string) {
        return this.portfolioService.findAndCount(token);
    }
}
