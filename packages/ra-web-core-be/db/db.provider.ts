import { Connection, createConnection, getConnectionManager } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { EnvironmentService } from "ra-web-env-be/environment.service";
import { RaUser } from "./entity/ra-user";
import { RaCompany } from "./entity/ra-company";
import { RaOrderStore } from "./entity/ra-order-store";
import { RaPreference } from "./entity/ra-preference";
import { RaMessage } from "./entity/ra-message";
import { RaPortfolio } from "./entity/ra-portfolio";
import { RaInputRules } from "./entity/ra-input-rules";
import { RaAccounts } from "./entity/ra-accounts";
import { RaAllocation } from "./entity/ra-allocation";
import { RaStock } from "./entity/ra-stock";
import { RaAllocationMessage } from "./entity/ra-allocation-message";
import { RaIoi } from "./entity/ra-ioi";
import { RaCounterParty } from "./entity/ra-counter-party";
import { RaOrderRel } from "./entity/ra-order-rel";
import { RaPortfolioAudit } from "./entity/ra-portfolio-audit";
import { RaOrderStoreAudit } from "./entity/ra-order-store-audit";
// import { closeHandlers } from "../../main";
import { entities } from "./entities";

export const databaseProviders = [
    {
        provide: "DbConnection",
        useFactory: async (env: EnvironmentService): Promise<Connection> => {
            if (getConnectionManager().has("default")) {
                return getConnectionManager().get("default");
            }
            const connection = await createConnection({
                type: env.db.type,
                schema: env.db.schema,
                host: env.db.host,
                port: env.db.port,
                username: env.db.user,
                password: env.db.password,
                database: env.db.db,
                entities: entities,
                synchronize: env.db.synch,
                logging: ((env.logging.db === "true" || env.logging.db === true) ? true : ["error"]),
                logger: "advanced-console"
            } as PostgresConnectionOptions);
            // closeHandlers.push(async () => {
            //     console.log(`Closing DbConnection`);
            //     if (connection.isConnected) {
            //         await connection.close();
            //     }
            // });
            return connection;
        },
        inject: [EnvironmentService],
    },
];


export const EntityProviders = [
    {
        provide: "raCompanyToken",
        useFactory: (connection: Connection) => connection.getRepository(RaCompany),
        inject: ["DbConnection"],
    },
    {
        provide: "raUserToken",
        useFactory: (connection: Connection) => connection.getRepository(RaUser),
        inject: ["DbConnection"],
    },
    {
        provide: "raOrderStoreToken",
        useFactory: (connection: Connection) => connection.getRepository(RaOrderStore),
        inject: ["DbConnection"],
    },
    {
        provide: "raMessageToken",
        useFactory: (connection: Connection) => connection.getRepository(RaMessage),
        inject: ["DbConnection"],
    },
    {
        provide: "raPreferenceToken",
        useFactory: (connection: Connection) => connection.getRepository(RaPreference),
        inject: ["DbConnection"],
    },
    {
        provide: "raPortfolioToken",
        useFactory: (connection: Connection) => connection.getRepository(RaPortfolio),
        inject: ["DbConnection"],
    },
    {
        provide: "raInputRulesToken",
        useFactory: (connection: Connection) => connection.getRepository(RaInputRules),
        inject: ["DbConnection"],
    },
    {
        provide: "raAccountsToken",
        useFactory: (connection: Connection) => connection.getRepository(RaAccounts),
        inject: ["DbConnection"],
    },
    {
        provide: "raCounterPartyToken",
        useFactory: (connection: Connection) => connection.getRepository(RaCounterParty),
        inject: ["DbConnection"],
    },
    {
        provide: "raAllocationsToken",
        useFactory: (connection: Connection) => connection.getRepository(RaAllocation),
        inject: ["DbConnection"],
    },
    {
        provide: "raAllocationMessageToken",
        useFactory: (connection: Connection) => connection.getRepository(RaAllocationMessage),
        inject: ["DbConnection"],
    },
    {
        provide: "raIoiToken",
        useFactory: (connection: Connection) => connection.getRepository(RaIoi),
        inject: ["DbConnection"],
    },
    {
        provide: "raStockDataToken",
        useFactory: (connection: Connection) => connection.getRepository(RaStock),
        inject: ["DbConnection"],
    }
];
