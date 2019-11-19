import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiUseTags } from "@nestjs/swagger";
import { Public } from "@ra/web-auth-be/dist/decorators/public.decorator";

@Controller()
@ApiUseTags("app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getInfo(): any {
    return this.appService.getInfo();
  }
}
