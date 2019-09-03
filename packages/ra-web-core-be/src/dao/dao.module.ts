import { Module, DynamicModule, Global } from "@nestjs/common";
import { repositoriesProvider } from "./repository.provider";
import { entities } from "./entities";
import { CoreModule } from "../core.module";
import { dataseProviders } from "../db/db.provider";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";

@Global()
@Module({
    imports: [
        CoreModule,
        EnvironmentsModule,
    ],
    controllers: [
    ],
    // providers: [
    //     ...dataseProviders(entities),
    //     ...repositoriesProvider,
    // ],
    // exports: [
    //     ...dataseProviders(entities),
    //     ...repositoriesProvider,
    // ]
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

    static forRoot(customEntities: any[], subscribers?: any[]): DynamicModule {
        DaoModule.mapEntity(customEntities);
        return {
            module: DaoModule,
            providers: [
                ...dataseProviders(Object.values(DaoModule.entitiesMap), subscribers),
                ...repositoriesProvider,
            ],
            exports: [
                ...dataseProviders(Object.values(DaoModule.entitiesMap), subscribers),
                ...repositoriesProvider,
            ],
        };
    }

    static forOMS(customEntities: any[], providers: any[]): DynamicModule {
        return {
            module: DaoModule,
            providers: [
                ...dataseProviders(customEntities),
                ...providers,
            ],
            exports: [
                ...dataseProviders(customEntities),
                ...providers,
            ],
        };
    }

}
