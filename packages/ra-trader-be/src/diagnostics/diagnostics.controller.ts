import { Controller, UseGuards, Get } from "@nestjs/common";
import { DiagnosticsService } from "./diagnostics.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("diagnostics")
export class DiagnosticsController {

    constructor(
        private diagnosticsService: DiagnosticsService,
    ) { }

    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @Get()
    public async getSystemStatus() {
        return await this.diagnosticsService.getSystemStatus();
    }

}
