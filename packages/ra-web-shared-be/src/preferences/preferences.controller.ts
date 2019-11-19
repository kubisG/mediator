import { Body, Controller, Get, Post, UseGuards, Put, Param, Delete } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { PreferencesService } from "./preferences.service";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger";
import { RolesGuard } from "@ra/web-auth-be/dist/guards/roles.guard";
import { Roles } from "@ra/web-auth-be/dist/decorators/roles.decorator";

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

    @Delete("delete-user/:name")
    @ApiBearerAuth()
    deleteUserPreference(@Bearer() auth: string, @Param("name") name: any) {
        return this.preferencesService.deleteUserPreference(name, auth);
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

    @Get("/hitlist/all/:hitlist")
    @UseGuards(AuthGuard())
    @ApiImplicitParam({ name: "hitlist" })
    async getHitlistsName(@Bearer() auth: string, @Param("hitlist") hitlist: string) {
        return await this.preferencesService.getHitlistsName(hitlist, auth);
    }

    @Get("default/:modul")
    @UseGuards(AuthGuard())
    async getDefault(@Bearer() auth: string, @Param("modul") modul: string): Promise<any> {
        return await this.preferencesService.getDefault(auth, modul);
    }

    @Post("default/:modul")
    @UseGuards(AuthGuard())
    async setDefault(@Bearer() auth: string, @Body() data: any, @Param("modul") modul: string): Promise<any> {
        return await this.preferencesService.setDefault(auth, modul, data.name);
    }

    @Post("settings/:name")
    @UseGuards(AuthGuard())
    async setPublicPrivate(@Bearer() auth: string, @Body() data: any, @Param("name") name: string): Promise<any> {
        return await this.preferencesService.setPublicPrivate(auth, data.state, name);
    }

    @Get("settings/:name")
    @UseGuards(AuthGuard())
    async getPublicPrivate(@Bearer() auth: string, @Param("name") name: string): Promise<any> {
        return await this.preferencesService.getPublicPrivate(auth, name);
    }
}
