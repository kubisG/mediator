import { Connection } from "typeorm";
import { AppDirectoryIntentRepository } from "./app-directory-intent.repository";
import { AppDirectoryTypeRepository } from "./app-directory-type.repository";
import { AppDirectoryRepository } from "./app-directory.repository";
import { databaseRepos } from "@ra/web-core-be/dist/db/db.provider";
import { RaAppDirectoryIntent } from "../entities/ra-app-directory-intent";
import { RaAppDirectoryType } from "../entities/ra-app-directory-type";
import { RaAppDirectory } from "../entities/ra-app-directory";

export const repositoriesProvider = [
    {
        provide: "appDirectoryIntentDao",
        useFactory: (connection: () => Connection)  => {
            const repo = connection().getRepository(RaAppDirectoryIntent);
            const form = new AppDirectoryIntentRepository(repo);

            return databaseRepos(form, repo);
        },
        inject: ["DbConnection"],
    },
    {
        provide: "appDirectoryTypeDao",
        useFactory: (connection: () => Connection)  => {
            const repo = connection().getRepository(RaAppDirectoryType);
            const form = new AppDirectoryTypeRepository(repo);

            return databaseRepos(form, repo);
        },
        inject: ["DbConnection"],
    },
    {
        provide: "appDirectoryDao",
        useFactory: (connection: () => Connection)  => {
            const repo = connection().getRepository(RaAppDirectory);
            const form = new AppDirectoryRepository(repo);

            return databaseRepos(form, repo);
        },
        inject: ["DbConnection"],
    },
];
