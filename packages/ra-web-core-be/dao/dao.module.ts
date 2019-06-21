import { Module } from "@nestjs/common";
import { repositoriesProvider } from "./repository.provider";
import { entities } from "./entities";
import { CoreModule } from "../core.module";
import { dataseProviders } from "../db/db.provider";

@Module({
    imports: [
        CoreModule,
    ],
    controllers: [
    ],
    providers: [
        ...dataseProviders(entities),
        ...repositoriesProvider,
    ],
    exports: [
        ...dataseProviders(entities),
        ...repositoriesProvider,
    ]
})
export class DaoModule {
    constructor() { }
}
