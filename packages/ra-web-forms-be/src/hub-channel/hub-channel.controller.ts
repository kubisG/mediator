import { Controller, UseGuards, Get } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiImplicitParam } from "@nestjs/swagger";
import { Bearer } from "@ra/web-auth-be/dist/decorators/bearer.decorator";
import { HubChannelService } from "./hub-channel.service";

@Controller("hub-channel")
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class HubChannelController {

    constructor(
        private formsService: HubChannelService,
    ) { }

    @Get("/")
    async testCall(@Bearer() token: string): Promise<any> {
        return await this.formsService.sendTests();
    }

}
