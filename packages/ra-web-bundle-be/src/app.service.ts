import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor (@Inject("dataFilter") dataFilter) {
    console.log("strated");

    const allSubj = dataFilter.getSubjects();
    for (const consumer in allSubj) {
        if (allSubj) {
          allSubj[consumer].subscribe(async (msg) => {
            console.log("WOHOOO", msg.msg.zprava);
          });
        }
      }
      setTimeout((mythis) => {
        mythis.sendToQueue({ zprava: "gogo" }, "TestQueue");
    }, 10000, dataFilter);

  }
  root(): string {

    return 'Hello World!';
  }
}
