import { RaUser } from "./ra-user";
import { RaPortfolio } from "./ra-portfolio";
import { RaCompany } from "./ra-company";
import { RaOrderStore } from "./ra-order-store";
import { RaPreference } from "./ra-preference";
import { RaMessage } from "./ra-message";
import { RaInputRules } from "./ra-input-rules";
import { RaAccounts } from "./ra-accounts";
import { RaAllocation } from "./ra-allocation";
import { RaAllocationMessage } from "./ra-allocation-message";
import { RaIoi } from "./ra-ioi";
import { RaStock } from "./ra-stock";
import { RaCurrency } from "./ra-currency";
import { RaCounterParty } from "./ra-counter-party";
import { RaOrderRel } from "./ra-order-rel";
import { RaPortfolioAudit } from "./ra-portfolio-audit";
import { RaOrderStoreAudit } from "./ra-order-store-audit";
import { RaInputRelations } from "./ra-input-relations";

export const entities = [
    RaUser,
    RaPortfolio,
    RaCompany,
    RaOrderStore,
    RaPreference,
    RaMessage,
    RaInputRules,
    RaInputRelations,
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
