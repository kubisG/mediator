import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiUseTags } from '@nestjs/swagger';

@Controller()
@ApiUseTags('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getInfo(): any {
    return this.appService.getInfo();
  }
}
