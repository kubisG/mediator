import { Controller, UseGuards, Get, Param, Put, Body, Post, Delete } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";
import { FormsSpecService } from "./forms-spec.service";
import { Roles } from "@ra/web-auth-be/dist/decorators/roles.decorator";

@Controller("admin-spec")
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class FormsSpecController {

    constructor(
        private formsService: FormsSpecService,
    ) { }

    @Roles("ADMIN")
    @Get("/admin/all")
    async getAdminMany(@Bearer() token: string): Promise<any> {
        return await this.formsService.findManyAdmin(token);
    }

    @Get("/all/")
    async getMany(@Bearer() token: string): Promise<any> {
        return await this.formsService.findMany(token);
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
}
