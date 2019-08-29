import { Connection } from "typeorm";
import { UserRepository } from "./repositories/user.repository";
import { PreferenceRepository } from "./repositories/preference.repository";
import { CompanyRepository } from "./repositories/company.repository";
import { ObjectRightsRepository } from "./repositories/object-rights.repository";

export const repositoriesProvider = [
    {
        provide: "userRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(UserRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "preferenceRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(PreferenceRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "companyRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(CompanyRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "objectRightsRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(ObjectRightsRepository),
        inject: ["DbConnection"],
    },
];
