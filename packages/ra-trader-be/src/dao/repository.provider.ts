import { Connection } from "typeorm";
import { CompanyRepository } from "./repositories/company.repository";
import { OrderStoreRepository } from "./repositories/order-store.repository";
import { MessageRepository } from "./repositories/message.repository";
import { UserRepository } from "./repositories/user.repository";
import { PreferenceRepository } from "./repositories/preference.repository";
import { PortfolioRepository } from "./repositories/portfolio.repository";
import { InputRulesRepository } from "./repositories/input-rules.repository";
import { AccountsRepository } from "./repositories/accounts.repository";
import { AllocationsRepository } from "./repositories/allocations.repository";
import { IoisRepository } from "./repositories/iois.repository";
import { AllocationMessageRepository } from "./repositories/allocation-message.repository";
import { StockRepository } from "./repositories/stock.repository";
import { CounterPartyRepository } from "./repositories/counter-party.repository";
import { OrderRelRepository } from "./repositories/order-rel.repository";
import { InputRelationsRepository } from "./repositories/input-relations.repository";

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
        provide: "orderStoreRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(OrderStoreRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "messageRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(MessageRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "preferenceRepository",
        useFactory: async (connection: () => Connection) => {
            return connection().getCustomRepository(PreferenceRepository);
        },
        inject: ["DbConnection"],
    },
    {
        provide: "portfolioRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(PortfolioRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "inputRulesRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(InputRulesRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "inputRelationsRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(InputRelationsRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "accountsRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(AccountsRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "counterPartyRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(CounterPartyRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "allocationsRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(AllocationsRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "ioisRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(IoisRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "allocationMessageRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(AllocationMessageRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "stockRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(StockRepository),
        inject: ["DbConnection"],
    },
    {
        provide: "orderRelRepository",
        useFactory: (connection: () => Connection) => connection().getCustomRepository(OrderRelRepository),
        inject: ["DbConnection"],
    }
];
