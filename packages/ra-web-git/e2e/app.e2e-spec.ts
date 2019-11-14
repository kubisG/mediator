import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as pjson from '../package.json';

describe('AppController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return application info', () => {
    // prepare
    const expectedInfo = { version: pjson.version, name: pjson.name };

    // execute & verify
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(expectedInfo);
  });
});
