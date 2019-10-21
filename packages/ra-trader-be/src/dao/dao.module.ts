import { Module } from "@nestjs/common";
import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { entityProviders } from "./repository.provider";
import { dataseProviders } from "@ra/web-core-be/dist/db/db.provider";
import { entities } from "../entity/entities";
import { EntityProviders } from "../entity/entity.providers";

@Module({
    imports: [
        CoreModule,
    ],
    controllers: [
    ],
    providers: [
        // ...dataseProviders(entities),
        // ...EntityProviders,
        // ...entityProviders,
    ],
    exports: [
        // ...dataseProviders(entities),
        // ...EntityProviders,
        // ...entityProviders,
    ]
})
export class WebDaoModule {
    constructor() { }
}
