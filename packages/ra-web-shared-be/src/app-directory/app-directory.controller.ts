import { Controller, UseGuards, Get, Param, Post, Body, Inject, Query, UseFilters } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Bearer } from "@ra/web-auth-be/decorators/bearer.decorator";
import { RolesGuard } from "@ra/web-auth-be/guards/roles.guard";
import { Roles } from "@ra/web-auth-be/decorators/roles.decorator";
import { AppDirectoryItemDto } from "./dto/app-directory-item.dto";
import { AppDirectoryService } from "./app-directory.service";
import { AppDirectoryDto } from "./dto/app-directory.dto";
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { SqlExceptionFilter } from "./error/sql-exception.filter";

@UseFilters(SqlExceptionFilter)
@ApiUseTags("apps")
@ApiBearerAuth()
@Controller("apps")
export class AppDirectoryController {

    constructor(private appDirectoryService: AppDirectoryService) { }

    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    @Post()
    public async createApp(@Bearer() token: string, @Body() app: AppDirectoryItemDto): Promise<AppDirectoryItemDto> {
        return this.appDirectoryService.createApp(token, app);
    }

    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    @Post("/:appId/:type")
    public async createManifest(token: string, @Body() manifest: any, @Param("appId") appId: string, @Param("type") type: string): Promise<any> {
        return this.appDirectoryService.createManifest(token, manifest, appId, type);
    }

    // @UseGuards(AuthGuard())
    @Get("/:appId")
    public async getAppDef(@Bearer() token: string, @Param("appId") appId: string): Promise<AppDirectoryItemDto> {
        return this.appDirectoryService.getAppDef(token, appId);
    }

    // @UseGuards(AuthGuard())
    @Get("/search")
    public async searchApps(@Bearer() token: string, @Query() query: any): Promise<AppDirectoryDto> {
        return this.appDirectoryService.searchApps(token, query);
    }

    // @UseGuards(AuthGuard())
    @Get("/manifest/:appId")
    public async getManifets(@Bearer() token: string, @Param("appId") appId: string): Promise<any> {
        return this.appDirectoryService.getManifest(token, appId);
    }

}
