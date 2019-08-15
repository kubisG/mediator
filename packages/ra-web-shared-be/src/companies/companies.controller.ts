import { Body, Controller, Delete, Get, Post, UseGuards, Param, Put } from "@nestjs/common";

import { CompanyDto } from "./dto/companies.dto";
import { CompaniesService } from "./companies.service";
import { RolesGuard } from "@ra/web-auth-be/dist/guards/roles.guard";
import { Roles } from "@ra/web-auth-be/dist/decorators/roles.decorator";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger/dist";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";

@Controller("companies")
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class CompaniesController {

    constructor(
        private readonly companiesService: CompaniesService,
    ) { }

    @Roles("ADMIN")
    @Put("/:id")
    @ApiImplicitParam({ name: "id" })
    update(@Bearer() token: string, @Param("id") id, @Body() companyDto: CompanyDto) {
        return this.companiesService.update(token, id, companyDto);
    }

    @Roles("MANAGER")
    @Put("/my/:id")
    @ApiImplicitParam({ name: "id" })
    updateMyCompany(@Bearer() token: string, @Param("id") id, @Body() companyDto: CompanyDto) {
        return this.companiesService.myUpdate(token, id, companyDto);
    }

    @Roles("ADMIN")
    @Delete("/:id")
    @ApiImplicitParam({ name: "id" })
    remove(@Param("id") id) {
        return this.companiesService.delete(id);
    }

    @Roles("ADMIN")
    @Post("/create")
    create(@Body() companyDto: CompanyDto) {
        return this.companiesService.create(companyDto);
    }

    @Get("/:id")
    @ApiImplicitParam({ name: "id" })
    findOne(@Bearer() token: string, @Param("id") id) {
        return this.companiesService.findOne(token, id);
    }

    @Get()
    findAll() {
        return this.companiesService.findAndCount();
    }
}
