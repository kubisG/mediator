import { Connection } from "typeorm";
import { FormsDataRepository } from "./repositories/forms-data.repository";
import { FormsSpecRepository } from "./repositories/forms-spec.repository";
import { RaFormsSpec } from "./entity/ra-forms-specification";
import { RaFormsData } from "./entity/ra-forms-data";
import { databaseRepos } from "@ra/web-core-be/dist/db/db.provider";
import { RaLocatesData } from "./entity/ra-locates-data";
import { LocatesDataRepository } from "./repositories/locates-data.repository";
import { RaExchangeData } from "./entity/ra-exhange-data";
import { ExchangeDataRepository } from "./repositories/exchange-data.repository";
import { RaRulesData } from "./entity/ra-rules-data";
import { RulesDataRepository } from "./repositories/rules-data.repository";
import { RaLocatesUpdate } from "./entity/ra-locates-update";
import { LocatesUpdateRepository } from "./repositories/locates-update.repository";

export const entityProviders = [
    {
        provide: "formsDataRepository",
        useFactory: (connection: () => Connection) => {
            const repo = connection().getRepository(RaFormsData);
            const form = new FormsDataRepository(repo);

            return databaseRepos(form, repo);
        },
        inject: ["DbConnection"],
    },
    {
        provide: "formsSpecRepository",
        useFactory: (connection: () => Connection) => {
            const repo = connection().getRepository(RaFormsSpec);
            const form = new FormsSpecRepository(repo);

            return databaseRepos(form, repo);
        },
        inject: ["DbConnection"],
    },
    {
        provide: "locatesDataRepository",
        useFactory: (connection: () => Connection) => {
            const repo = connection().getRepository(RaLocatesData);
            const form = new LocatesDataRepository(repo);

            return databaseRepos(form, repo);
        },
        inject: ["DbConnection"],
    },
    {
        provide: "exchangeDataRepository",
        useFactory: (connection: () => Connection) => {
            const repo = connection().getRepository(RaExchangeData);
            const form = new ExchangeDataRepository(repo);

            return databaseRepos(form, repo);
        },
        inject: ["DbConnection"],
    },
    {
        provide: "rulesDataRepository",
        useFactory: (connection: () => Connection) => {
            const repo = connection().getRepository(RaRulesData);
            const form = new RulesDataRepository(repo);

            return databaseRepos(form, repo);
        },
        inject: ["DbConnection"],
    },
    {
        provide: "locatesUpdateRepository",
        useFactory: (connection: () => Connection) => {
            const repo = connection().getRepository(RaLocatesUpdate);
            const form = new LocatesUpdateRepository(repo);

            return databaseRepos(form, repo);
        },
        inject: ["DbConnection"],
    },
];
