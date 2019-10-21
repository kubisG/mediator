import { Body, Controller, Delete, Get, Post, UseGuards, Param, Put, Query } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { AuthDto } from "@ra/web-auth-be/dist/dto/auth.dto";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";
import { UsersService } from "./users.service";
import { UserDto } from "./dto/user.dto";
import { RolesGuard } from "@ra/web-auth-be/dist/guards/roles.guard";
import { Roles } from "@ra/web-auth-be/dist/decorators/roles.decorator";
import { ApiBearerAuth, ApiImplicitParam, ApiImplicitQuery } from "@nestjs/swagger/dist";

@Controller("users")
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Post("auth")
    async logIn(@Body() auth: AuthDto): Promise<any> {
        return await this.usersService.logIn(auth);
    }

    @Post("reset")
    async reset(@Body() body: any): Promise<any> {
        return await this.usersService.resetMail(body.email);
    }

    @Delete("auth")
    async logOut(@Bearer() auth: string): Promise<any> {
        return await this.usersService.logOut(auth);
    }

    @Post("user")
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles("ADMIN")
    async createUser(@Bearer() auth: string, @Body() user: UserDto): Promise<any> {
        return await this.usersService.createUser(auth, user);
    }

    @Get("logging/:userId/:companyId/:enabled")
    @ApiImplicitParam({ name: "userId" })
    @ApiImplicitParam({ name: "companyId" })
    @ApiImplicitParam({ name: "enabled" })
    setLogging(@Param("userId") userId: number, @Param("companyId") companyId: number, @Param("enabled") enabled: string) {
        return this.usersService.setLogging(userId, companyId, enabled);
    }

    @Put("user/:id")
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @ApiImplicitParam({ name: "id" })
    async updateUser(@Bearer() auth: string, @Param("id") id, @Body() user: UserDto) {
        return await this.usersService.updateUser(id, user, auth);
    }

    @Delete("user/:id")
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles("ADMIN")
    @ApiImplicitParam({ name: "id" })
    remove(@Param("id") id) {
        return this.usersService.delete(id);
    }

    @Get("prefs")
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles("ADMIN")
    getUsersLayoutPreferences() {
        return this.usersService.getUsersLayoutPreferences();
    }

    @Get("user/:id")
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @ApiImplicitParam({ name: "id" })
    findOne(@Param("id") id) {
        return this.usersService.findOne(id);
    }

    @Get("user")
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles("ADMIN")
    @ApiImplicitQuery({ name: "skip", required: false })
    @ApiImplicitQuery({ name: "sort", required: false })
    findAll(@Bearer() auth: string, @Query("skip") skip: number, @Query("sort") sort: string) {
        return this.usersService.findAll(auth, skip, sort);
    }

    @Get("company")
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    findCompAll(@Bearer() auth: string) {
        return this.usersService.findCompAll(auth);
    }

    @Get("layout/:name")
    @UseGuards(AuthGuard())
    async getLayout(@Bearer() auth: string, @Param("name") name: string): Promise<any> {
        return await this.usersService.getLayoutConfig(auth, name);
    }

    @Post("layout/:name")
    @UseGuards(AuthGuard())
    async setLayout(@Bearer() auth: string, @Body() config: any, @Param("name") name: string): Promise<any> {
        return await this.usersService.setLayoutConfig(auth, config, name);
    }

    @Get("layout-default/:modul")
    @UseGuards(AuthGuard())
    async getLayoutDefault(@Bearer() auth: string, @Param("modul") modul: string): Promise<any> {
        return await this.usersService.getLayoutDefault(auth, modul);
    }

    @Post("layout-default/:modul")
    @UseGuards(AuthGuard())
    async setLayoutDefault(@Bearer() auth: string, @Body() data: any, @Param("modul") modul: string): Promise<any> {
        return await this.usersService.setLayoutDefault(auth, modul, data.name);
    }

    @Delete("layout/:name")
    @UseGuards(AuthGuard())
    async deleteLayout(@Bearer() auth: string, @Param("name") name: string) {
        return await this.usersService.deleteLayoutConfig(auth, name);
    }

    @Get("layout")
    @UseGuards(AuthGuard())
    async getLayoutsName(@Bearer() auth: string) {
        return await this.usersService.getLayoutsName(auth);
    }

}
