import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as pjson from '../package.json';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return application info', () => {
    // prepare
    const expectedInfo = { version: pjson.version, name: pjson.name };

    // execute
    const info = appController.getInfo();

    // verify
    expect(info).toBe(expectedInfo);
  });
});
