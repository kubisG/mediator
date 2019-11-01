import { Body, Controller, Delete, Get, Post, UseGuards, Param, Put, Query } from "@nestjs/common";

import { CompanyDto } from "./dto/companies.dto";
import { CompaniesService } from "./companies.service";
import { RolesGuard } from "@ra/web-auth-be/dist/guards/roles.guard";
import { Roles } from "@ra/web-auth-be/dist/decorators/roles.decorator";
import { ApiBearerAuth, ApiImplicitParam, ApiImplicitQuery } from "@nestjs/swagger/dist";
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
    @ApiImplicitQuery({ name: "skip", required: false })
    @ApiImplicitQuery({ name: "take", required: false })
    @ApiImplicitQuery({ name: "sort", required: false })
    @ApiImplicitQuery({ name: "sortDir", required: false })
    findAll(@Query("skip") skip?: number, @Query("take") take?: number, @Query("sort") sort?: string
        ,   @Query("sortDir") sortDir?: string, @Query("filter") filter?: any) {
        return this.companiesService.findAndCount(skip, take, sort, sortDir, null);
    }
}
