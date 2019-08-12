import { Controller, Get, UseGuards, Param, Post, Body, Delete } from "@nestjs/common";
import { LayoutService } from "./layout.service";
import { AuthGuard } from "@nestjs/passport";
import { Bearer } from "@ra/web-auth-be/decorators/bearer.decorator";

@Controller("layout")
export class LayoutController {

    constructor(
        private layoutService: LayoutService,
    ) { }

    @Get(":name")
    @UseGuards(AuthGuard())
    async getLayout(@Bearer() auth: string, @Param("name") name: string): Promise<any> {
        return await this.layoutService.getLayoutConfig(auth, name);
    }

    @Post("layout/:name")
    @UseGuards(AuthGuard())
    async setLayout(@Bearer() auth: string, @Body() config: any, @Param("name") name: string): Promise<any> {
        return await this.layoutService.setLayoutConfig(auth, config, name);
    }

    @Delete("layout/:name")
    @UseGuards(AuthGuard())
    async deleteLayout(@Bearer() auth: string, @Param("name") name: string) {
        return await this.layoutService.deleteLayoutConfig(auth, name);
    }

    @Get("layout")
    @UseGuards(AuthGuard())
    async getLayoutsName(@Bearer() auth: string) {
        return await this.layoutService.getLayoutsName(auth);
    }

    @Get("layout-default/:modul")
    @UseGuards(AuthGuard())
    async getLayoutDefault(@Bearer() auth: string, @Param("modul") modul: string): Promise<any> {
        return await this.layoutService.getLayoutDefault(auth, modul);
    }
    
    @Post("layout-default/:modul")
    @UseGuards(AuthGuard())
    async setLayoutDefault(@Bearer() auth: string, @Body() data: any, @Param("modul") modul: string): Promise<any> {
        return await this.layoutService.setLayoutDefault(auth, modul, data.name);
    }
    
    

}
