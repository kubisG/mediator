import { Controller, UseGuards, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { RolesGuard } from "@ra/web-auth-be/dist/guards/roles.guard";
import { AccountsService } from "./accounts.service";
import { Roles } from "@ra/web-auth-be/dist/decorators/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { AccountsDto } from "./dto/accounts.dto";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger/dist";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";

@Controller("accounts")
export class AccountsController {

    constructor(
        private accountService: AccountsService,
    ) { }

    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @Get()
    geAccounts(@Bearer() token: string) {
        return this.accountService.geAccounts(token);
    }

    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @Get("/:id")
    @ApiImplicitParam({ name: "id" })
    geAccount(@Bearer() token: string, @Param("id") id) {
        return this.accountService.findOne(id, token);
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles("MANAGER", "ADMIN")
    @Post()
    saveAccounts(@Bearer() token: string, @Body() data: AccountsDto) {
        return this.accountService.save(data, token);
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles("MANAGER", "ADMIN")
    @Delete("/:id")
    @ApiImplicitParam({ name: "id" })
    removeAccounts(@Bearer() token: string, @Param("id") id) {
        return this.accountService.delete(id, token);
    }
}
