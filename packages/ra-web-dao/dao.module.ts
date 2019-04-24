import { Module } from "@nestjs/common";
import { CoreModule } from "../core/core.module";
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
