import { RaUser } from "./entity/ra-user";
import { RaPortfolio } from "./entity/ra-portfolio";
import { RaCompany } from "./entity/ra-company";
import { RaOrderStore } from "./entity/ra-order-store";
import { RaPreference } from "./entity/ra-preference";
import { RaMessage } from "./entity/ra-message";
import { RaInputRules } from "./entity/ra-input-rules";
import { RaAccounts } from "./entity/ra-accounts";
import { RaAllocation } from "./entity/ra-allocation";
import { RaAllocationMessage } from "./entity/ra-allocation-message";
import { RaIoi } from "./entity/ra-ioi";
import { RaStock } from "./entity/ra-stock";
import { RaCounterParty } from "./entity/ra-counter-party";
import { RaOrderRel } from "./entity/ra-order-rel";
import { RaPortfolioAudit } from "./entity/ra-portfolio-audit";
import { RaOrderStoreAudit } from "./entity/ra-order-store-audit";
import { RaCurrency } from "./entity/ra-currency";

export const entities = [
    RaUser,
    RaPortfolio,
    RaCompany,
    RaOrderStore,
    RaPreference,
    RaMessage,
    RaInputRules,
    RaAccounts,
    RaAllocation,
    RaAllocationMessage,
    RaIoi,
    RaStock,
    RaCurrency,
    RaCounterParty,
    RaOrderRel,
    RaPortfolioAudit,
    RaOrderStoreAudit,
];
