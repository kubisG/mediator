import { Connection } from "typeorm";
import { RaCompany } from "./ra-company";
import { RaUser } from "./ra-user";
import { RaOrderStore } from "./ra-order-store";
import { RaMessage } from "./ra-message";
import { RaPreference } from "./ra-preference";
import { RaPortfolio } from "./ra-portfolio";
import { RaInputRules } from "./ra-input-rules";
import { RaAccounts } from "./ra-accounts";
import { RaCounterParty } from "./ra-counter-party";
import { RaAllocation } from "./ra-allocation";
import { RaAllocationMessage } from "./ra-allocation-message";
import { RaIoi } from "./ra-ioi";
import { RaStock } from "./ra-stock";
import { RaInputRelations } from "./ra-input-relations";

export const EntityProviders = [
    {
        provide: "raCompanyToken",
        useFactory: (connection: () => Connection) => connection().getRepository(RaCompany),
        inject: ["DbConnection"],
    },
    {
        provide: "raUserToken",
        useFactory: (connection: () => Connection) => connection().getRepository(RaUser),
        inject: ["DbConnection"],
    },
    {
        provide: "raOrderStoreToken",
        useFactory: (connection: () => Connection) => connection().getRepository(RaOrderStore),
        inject: ["DbConnection"],
    },
    {
        provide: "raMessageToken",
        useFactory: (connection: () => Connection) => connection().getRepository(RaMessage),
        inject: ["DbConnection"],
    },
    {
        provide: "raPreferenceToken",
        useFactory: (connection: () => Connection) => connection().getRepository(RaPreference),
        inject: ["DbConnection"],
    },
    {
        provide: "raPortfolioToken",
        useFactory: (connection: () => Connection) => connection().getRepository(RaPortfolio),
        inject: ["DbConnection"],
    },
    {
        provide: "raInputRulesToken",
        useFactory: (connection: () => Connection) => connection().getRepository(RaInputRules),
        inject: ["DbConnection"],
    },
    {
        provide: "raInputRelationsToken",
        useFactory: (connection: () => Connection) => connection().getRepository(RaInputRelations),
        inject: ["DbConnection"],
    },
    {
        provide: "raAccountsToken",
        useFactory: (connection: () => Connection) => connection().getRepository(RaAccounts),
        inject: ["DbConnection"],
    },
    {
        provide: "raCounterPartyToken",
        useFactory: (connection: () => Connection) => connection().getRepository(RaCounterParty),
        inject: ["DbConnection"],
    },
    {
        provide: "raAllocationsToken",
        useFactory: (connection: () => Connection) => connection().getRepository(RaAllocation),
        inject: ["DbConnection"],
    },
    {
        provide: "raAllocationMessageToken",
        useFactory: (connection: () => Connection) => connection().getRepository(RaAllocationMessage),
        inject: ["DbConnection"],
    },
    {
        provide: "raIoiToken",
        useFactory: (connection: () => Connection) => connection().getRepository(RaIoi),
        inject: ["DbConnection"],
    },
    {
        provide: "raStockDataToken",
        useFactory: (connection: () => Connection) => connection().getRepository(RaStock),
        inject: ["DbConnection"],
    },
];
