import { Module } from "@nestjs/common";

import { CoreModule } from "@ra/web-core-be/dist/core.module";
import { DaoModule } from "@ra/web-core-be/dist/dao/dao.module";
import { UsersModule } from "./users/users.module";
import { CompaniesModule } from "./companies/companies.module";
import { PreferencesModule } from "./preferences/preferences.module";
import { OrdersModule } from "./orders/orders.module";
import { PortfolioModule } from "./portfolio/portfolio.module";
import { InputRulesModule } from "./input-rules/input-rules.module";
import { AccountsModule } from "./accounts/accounts.module";
import { DiagnosticsModule } from "./diagnostics/diagnostics.module";
import { StockDataModule } from "./stock-data/stock-data.module";
import { MessagesModule } from "./messages/messages.module";
import { HealthModule } from "./health/health.module";
import { BrokerModule } from "./broker/broker.module";
import { TraderModule } from "./trader/trader.module";
import { IoisModule } from "./iois/iois.module";
import { BrokerIoisModule } from "./broker-iois/broker-iois.module";
import { TraderIoisModule } from "./trader-iois/trader-iois.module";
import { AllocationsModule } from "./allocations/allocations.module";
import { TraderAllocationsModule } from "./trader-allocations/trader-allocations.module";
import { BrokerAllocationsModule } from "./broker-allocations/broker-allocations.module";
import { SleuthModule } from "./sleuth/sleuth.module";
import { CounterPartyModule } from "./counter-party/counter-party.module";
import { ConnectionModule } from "./connection/connection.module";
import { entities } from "./entity/entities";
import { EntityProviders } from "./entity/entity.providers";
import { entityProviders } from "./dao/repository.provider";
import { TerminusModule } from "@nestjs/terminus";
import { LifeCheckService } from "@ra/web-core-be/dist/life-check/life-check.service";
import { LifeCheckModule } from "@ra/web-core-be/dist/life-check/life-check.module";

@Module({
    imports: [
        CoreModule,
        DaoModule.forOMS(entities, [
            ...EntityProviders,
            ...entityProviders,
        ]),
        HealthModule,
        UsersModule,
        CompaniesModule,
        PreferencesModule,
        OrdersModule,
        PortfolioModule,
        InputRulesModule,
        AccountsModule,
        DiagnosticsModule,
        StockDataModule,
        MessagesModule,
        IoisModule,
        TraderAllocationsModule,
        BrokerAllocationsModule,
        AllocationsModule,
        TraderIoisModule,
        BrokerIoisModule,
        BrokerModule,
        TraderModule,
        SleuthModule,
        ConnectionModule,
        CounterPartyModule,
        TerminusModule.forRootAsync({
            imports: [LifeCheckModule],
            useClass: LifeCheckService,
        }),
    ],
    controllers: [
    ],
    providers: [
    ]
})
export class AppModule { }
