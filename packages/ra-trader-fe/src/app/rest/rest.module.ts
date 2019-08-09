import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RestCompaniesService } from "./rest-companies.service";
import { RestUsersService } from "./rest-users.service";
import { RestPreferencesService } from "./rest-preferences.service";
import { RestAccountsService } from "./rest-accounts.service";
import { RestPortfolioService } from "./rest-portfolio.service";
import { RestInputRulesService } from "./rest-input-rules.service";
import { RestAllocationsService } from "./rest-allocations.service";
import { RestDiagnostics } from "./rest-diagnostincs";
import { RestStockDataService } from "./rest-stock-data.service";
import { RestIoisService } from "./rest-iois.service";
import { RestTraderService } from "./rest-trader.service";
import { RestSleuthService } from "./rest-sleuth.service";
import { RestCounterPartyService } from "./rest-counter-party.service";
import { OrderInitService } from "./order-init.service";


@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        RestCompaniesService,
        RestUsersService,
        RestPreferencesService,
        RestTraderService,
        RestAccountsService,
        RestPortfolioService,
        RestInputRulesService,
        RestAllocationsService,
        RestDiagnostics,
        RestStockDataService,
        RestIoisService,
        RestSleuthService,
        RestCounterPartyService,
        OrderInitService,
    ],
})
export class RestModule {
    constructor(@Optional() @SkipSelf() parentModule: RestModule) {
        if (parentModule) {
            throw new Error(
                "RestModule is already loaded. Import it in the AppModule only");
        }
    }
}
