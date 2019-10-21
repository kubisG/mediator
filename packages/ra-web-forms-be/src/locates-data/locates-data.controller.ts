import { Controller, UseGuards, Get, Param, Put, Body, Post, Delete } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";
import { LocatesService } from "./locates-data.service";

@Controller("locates")
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class LocatesDataController {

    constructor(
        private locatesService: LocatesService,
    ) { }

    @Get("/all/:typ/:dates/")
    @ApiImplicitParam({ name: "dates" })
    @ApiImplicitParam({ name: "typ" })
    async getMany(@Param("typ") typ: string, @Param("dates") dates: string, @Bearer() token: string): Promise<any> {
        return await this.locatesService.findMany(token, dates, typ);
    }

    @Post()
    async insert(@Bearer() token: string, @Body() data: any): Promise<any> {
        return await this.locatesService.saveData(token, data);
    }

    @Get(":id")
    @ApiImplicitParam({ name: "id" })
    async findOne(@Bearer() token: string, @Param("id") id): Promise<any> {
        return await this.locatesService.findOne(token, id);
    }

    @Delete(":id")
    @ApiImplicitParam({ name: "id" })
    async deleteOne(@Bearer() token: string, @Param("id") id): Promise<any> {
        return await this.locatesService.delete(token, id);
    }

    @Post("/external")
    async getExternalData(@Bearer() token: string, @Body() data: any): Promise<any> {
        return await this.locatesService.getExternalData(token, data);
    }

    @Get("/subrules/:typ")
    @ApiImplicitParam({ name: "typ" })
    async getRulesData(@Bearer() token: string,  @Param("typ") typ): Promise<any> {
        return await this.locatesService.getRules(token, typ);
    }

}
