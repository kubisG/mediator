import { Connection } from "typeorm";
import { AppDirectoryIntentRepository } from "./app-directory-intent.repository";
import { AppDirectoryTypeRepository } from "./app-directory-type.repository";
import { AppDirectoryRepository } from "./app-directory.repository";

export const repositoriesProvider = [
    {
        provide: "appDirectoryIntentDao",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(AppDirectoryIntentRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "appDirectoryTypeDao",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(AppDirectoryTypeRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "appDirectoryDao",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(AppDirectoryRepository),
        inject: ["DbConnection"],
    }
];
