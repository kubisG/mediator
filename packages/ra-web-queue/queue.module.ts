import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/core.module";

@Module({
    imports: [
        CoreModule,
    ],
    controllers: [],
    providers: []
})
export class QueueModule {
}
