import { Injectable } from '@nestjs/common';
import * as pjson from '../package.json';

@Injectable()
export class AppService {

  getInfo(): any {
    return { version: pjson.version, name: pjson.name };
  }
}
