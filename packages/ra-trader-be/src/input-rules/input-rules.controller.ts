import { Controller, UseGuards, Get, Post, Body, Param } from "@nestjs/common";
import { RolesGuard } from "@ra/web-auth-be/dist/guards/roles.guard";
import { InputRulesService } from "./input-rules.service";
import { Roles } from "@ra/web-auth-be/dist/decorators/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RulesDto } from "./dto/input-rules.dto";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger/dist";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";

@Controller("input-rules")
export class InputRulesController {

    constructor(
        private inputRulesService: InputRulesService,
    ) { }

    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles("ADMIN")
    @Get("/admin")
    getInputsAdmin(@Bearer() token: string) {
        return this.inputRulesService.getInputs(token, true);
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Roles("ADMIN")
    @Post()
    saveInputs(@Bearer() token: string, @Body() data: RulesDto) {
        return this.inputRulesService.saveInputs(token, data);
    }

    @Get("/:label")
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @ApiImplicitParam({ name: "label" })
    getRules(@Bearer() token: string, @Param("label") label: string) {
        return this.inputRulesService.getRules(token, label);
    }

    @Get("/type/:type")
    @ApiImplicitParam({ name: "type" })
    findByType(@Bearer() token: string, @Param("type") type) {
        return this.inputRulesService.findByType(token, type);
    }

    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @Get()
    getInputs(@Bearer() token: string) {
        return this.inputRulesService.getInputs(token);
    }

}
