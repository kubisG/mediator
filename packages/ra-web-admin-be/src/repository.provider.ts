import { Connection } from "typeorm";
import { CompanyRepository } from "./repositories/company.repository";
import { UserRepository } from "./repositories/user.repository";
import { PreferenceRepository } from "./repositories/preference.repository";

export const entityProviders = [
    {
        provide: "companyRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(CompanyRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "userRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(UserRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "preferenceRepository",
        useFactory: async (connection: () => Connection) => {
            return connection().getCustomRepository(PreferenceRepository);
        },
        inject: ["DbConnection"],
    },
];
