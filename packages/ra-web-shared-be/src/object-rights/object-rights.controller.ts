import { Body, Controller, Get, Post, UseGuards, Put, Param, Delete } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { ObjectRightsService } from "./object-rights.service";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger";
import { RolesGuard } from "@ra/web-auth-be/dist/guards/roles.guard";
import { Roles } from "@ra/web-auth-be/dist/decorators/roles.decorator";

@Controller("object-rights")
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class ObjectRightsController {

    constructor(
        private readonly objectRightsService: ObjectRightsService,
    ) { }

    @Get("/my/:name")
    @ApiImplicitParam({ name: "name" })
    getObjectRight(@Bearer() auth: string, @Param("name") name: string) {
        return this.objectRightsService.getObjectRight(auth, name);
    }

    @Post()
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles("ADMIN")
    saveRight(@Bearer() auth: string, @Body() objectRights: any) {
        return this.objectRightsService.saveRight(objectRights, auth);
    }

    @Delete("/delete/:id")
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles("ADMIN")
    deleteRight(@Param("id") id: number) {
        return this.objectRightsService.deleteRight(id);
    }

    @Get("/all")
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles("ADMIN")
    findAll(@Bearer() auth: string) {
        return this.objectRightsService.findAll(auth);
    }

    @Get("/user")
    findUseRights(@Bearer() auth: string) {
        return this.objectRightsService.getUserRights(auth);
    }
}
