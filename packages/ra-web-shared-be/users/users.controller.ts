import { Controller, Post, Body, Delete, Get, UseGuards, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthDto } from "@ra/web-auth-be/dto/auth.dto";
import { Bearer } from "@ra/web-auth-be/decorators/bearer.decorator";
import { AuthGuard } from "@nestjs/passport";

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
