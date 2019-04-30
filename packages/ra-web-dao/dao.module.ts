import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/core.module";
import { entityProviders } from "./repository.provider";

@Module({
    imports: [
        CoreModule,
    ],
    controllers: [
    ],
    providers: [
        ...entityProviders,
    ],
    exports: [
        ...entityProviders,
    ]
})
export class DaoModule {
    constructor() { }
}
