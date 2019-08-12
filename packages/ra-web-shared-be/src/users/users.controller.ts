import { Controller, Post, Body, Delete, Get, Put, UseGuards, Param, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthDto } from "@ra/web-auth-be/dto/auth.dto";
import { Bearer } from "@ra/web-auth-be/decorators/bearer.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "@ra/web-auth-be/guards/roles.guard";
import { ApiBearerAuth, ApiImplicitParam, ApiImplicitQuery } from "@nestjs/swagger/dist";
import { Roles } from "@ra/web-auth-be/decorators/roles.decorator";

@Controller("users")
export class UsersController {

    constructor(
        private usersService: UsersService,
    ) { }

    @Post("auth")
    async logIn(@Body() auth: AuthDto): Promise<any> {
        return await this.usersService.logIn(auth);
    }

    @Delete("auth")
    async logOut(@Bearer() auth: string): Promise<any> {
        return await this.usersService.logOut(auth);
    }

    @Post("reset")
    async reset(@Body() body: any): Promise<any> {
        return await this.usersService.resetMail(body.email);
    }

    @Post("user")
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles("ADMIN")
    async createUser(@Bearer() auth: string, @Body() user: any): Promise<any> {
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
    async updateUser(@Bearer() auth: string, @Param("id") id, @Body() user: any) {
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
    findAll(@Bearer() auth: string) {
        return this.usersService.findAll(auth);
    }

    @Get("company")
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    findCompAll(@Bearer() auth: string) {
        return this.usersService.findCompAll(auth);
    }

}
