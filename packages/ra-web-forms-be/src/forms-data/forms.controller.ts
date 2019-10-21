import { Controller, UseGuards, Get, Param, Put, Body, Post, Delete } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";
import { FormsService } from "./forms.service";

@Controller("forms")
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class FormsController {

    constructor(
        private formsService: FormsService,
    ) { }

    @Get("/all/:typ/:dates/")
    @ApiImplicitParam({ name: "dates" })
    @ApiImplicitParam({ name: "typ" })
    async getMany(@Param("typ") typ: string, @Param("dates") dates: string, @Bearer() token: string): Promise<any> {
        return await this.formsService.findMany(token, dates, typ);
    }

    @Post()
    async insert(@Bearer() token: string, @Body() data: any): Promise<any> {
        return await this.formsService.saveData(token, data);
    }

    @Get(":id")
    @ApiImplicitParam({ name: "id" })
    async findOne(@Bearer() token: string, @Param("id") id): Promise<any> {
        return await this.formsService.findOne(token, id);
    }

    @Delete(":id")
    @ApiImplicitParam({ name: "id" })
    async deleteOne(@Bearer() token: string, @Param("id") id): Promise<any> {
        return await this.formsService.delete(token, id);
    }

    @Get("/lists/")
    async getLists(@Bearer() token: string): Promise<any> {
        return await this.formsService.findLists(token);
    }

    @Get("/lists/:id")
    @ApiImplicitParam({ name: "id" })
    async getOne(@Bearer() token: string, @Param("id") key): Promise<any> {
        const record = await this.formsService.findList(token, key);
        if (record) {
            return record.spec;
        } else {
            return;
        }
    }

    @Post("/external")
    async getExternalData(@Bearer() token: string, @Body() data: any): Promise<any> {
        return await this.formsService.getExternalData(token, data);
    }

    @Get("/internal/:table")
    @ApiImplicitParam({ name: "table" })
    async getTableData(@Bearer() token: string,  @Param("table") table): Promise<any> {
        return await this.formsService.getTableData(token, table);
    }

    @Get("/subrules/:typ")
    @ApiImplicitParam({ name: "typ" })
    async getRulesData(@Bearer() token: string,  @Param("typ") typ): Promise<any> {
        return await this.formsService.getRules(token, typ);
    }

    @Get("/history/:id")
    @ApiImplicitParam({ name: "id" })
    async getRecordHistory(@Bearer() token: string, @Param("id") id): Promise<any> {
        return await this.formsService.findHistory(token, id);
    }

}
