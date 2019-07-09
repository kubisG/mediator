import { Controller, UseGuards, Get, Param, Post, Body, Inject } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Bearer } from "@ra/web-auth-be/decorators/bearer.decorator";
import { RolesGuard } from "@ra/web-auth-be/guards/roles.guard";
import { Roles } from "@ra/web-auth-be/decorators/roles.decorator";
import { AppDirectoryItemDto } from "./dto/app-directory-item.dto";
import { AppDirectoryService } from "./app-directory.service";
import { AppDirectoryDto } from "./dto/app-directory.dto";

@Controller("apps")
@UseGuards(AuthGuard())
export class AppDirectoryController {

    constructor(private appDirectoryService: AppDirectoryService) { }

    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    @Post()
    public async createApp(@Bearer() token: string, @Body() app: AppDirectoryItemDto): Promise<AppDirectoryDto> {
        return this.appDirectoryService.createApp(token, app);
    }

    @Get("/:appId")
    public async getAppDef(@Bearer() token: string, @Param("appId") appId: number): Promise<AppDirectoryItemDto> {
        return this.appDirectoryService.getAppDef(token, appId);
    }

    @Post("/search")
    public async searchApps(@Bearer() token: string, @Body() app: AppDirectoryItemDto): Promise<AppDirectoryDto> {
        return this.appDirectoryService.searchApps(token, app);
    }

}
