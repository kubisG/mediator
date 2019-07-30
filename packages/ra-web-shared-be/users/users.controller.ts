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

}
