import { Body, Controller, Get, Post, UseGuards, Put, Param, Delete } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { PreferencesService } from "./preferences.service";
import { Bearer } from "@ra/web-auth-be/decorators/bearer.decorator";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger";
import { RolesGuard } from "@ra/web-auth-be/guards/roles.guard";
import { Roles } from "@ra/web-auth-be/decorators/roles.decorator";


@Controller("preferences")
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class PreferencesController {

    constructor(
        private readonly preferencesService: PreferencesService,
    ) { }

    @Get("/hitlist/:key")
    @ApiImplicitParam({ name: "key" })
    getStorage(@Bearer() auth: string, @Param("key") key) {
        return this.preferencesService.loadUserPref(auth, "hitlist_" + key);
    }

    @Put("/hitlist/:key")
    @ApiImplicitParam({ name: "key" })
    setStorage(@Bearer() auth: string, @Param("key") key, @Body() storage: any) {
        return this.preferencesService.saveUserPref(auth, "hitlist_" + key, storage.body);
    }

    @Get("/app/:name")
    @ApiImplicitParam({ name: "name" })
    getAppPref(@Param("name") name: string) {
        return this.preferencesService.getAppPref(name);
    }

    @Post()
    create(@Bearer() auth: string, @Body() preferenceDto: any) {
        return this.preferencesService.save(preferenceDto, auth);
    }

    @Post("/update")
    update(@Bearer() auth: string, @Body() pref: any) {
        return this.preferencesService.update(pref, auth);
    }

    @Get()
    findAll(@Bearer() auth: string) {
        return this.preferencesService.find(auth);
    }

    @Get("all")
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles("ADMIN")
    findAllPrefs() {
        return this.preferencesService.findAll();
    }

    @Post("save")
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles("ADMIN")
    savePreference(@Body() pref: any) {
        return this.preferencesService.savePreference(pref);
    }

    @Delete("delete/:name/:user/:company")
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles("ADMIN")
    deletePreference(@Param("name") name: any, @Param("user") user: number, @Param("company") company: number) {
        return this.preferencesService.deletePreference(name, user, company);
    }

    @Get("/user/:name")
    @ApiImplicitParam({ name: "name" })
    findUserPref(@Bearer() auth: string, @Param("name") name: string) {
        return this.preferencesService.loadUserPref(auth, name);
    }

    @Post("/user/:name")
    @ApiImplicitParam({ name: "name" })
    setUserPref(@Bearer() auth: string, @Param("name") name: string, @Body() mypref: any) {
        return this.preferencesService.saveUserPref(auth, name, mypref);
    }
}
