import { Module, Inject } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/core.module";
import { queueFactory } from "./queue.provider";

@Module({
    imports: [
        CoreModule,
    ],
    controllers: [],
    providers: [
        ...queueFactory,
    ],
    exports: [
        ...queueFactory,
    ]
})
export class QueueModule { }
