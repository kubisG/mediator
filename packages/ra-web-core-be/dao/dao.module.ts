import { Module, DynamicModule } from "@nestjs/common";
import { repositoriesProvider } from "./repository.provider";
import { entities } from "./entities";
import { CoreModule } from "../core.module";
import { dataseProviders } from "../db/db.provider";
import { AEntity } from "../db/a-entity";

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

    static entitiesMap: { [key: string]: any } = {};

    static mapEntity(customEntities: any[]) {
        const mergedEntities = [
            ...entities,
            ...customEntities,
        ];
        for (const entity of mergedEntities) {
            DaoModule.entitiesMap[entity.name] = entity;
        }
    }

    static forRoot(customEntities: any[]): DynamicModule {
        DaoModule.mapEntity(customEntities);
        return {
            module: DaoModule,
            providers: [
                ...dataseProviders(Object.values(DaoModule.entitiesMap)),
                ...repositoriesProvider,
            ],
            exports: [
                ...dataseProviders(Object.values(DaoModule.entitiesMap)),
                ...repositoriesProvider,
            ]
        };
    }
}
