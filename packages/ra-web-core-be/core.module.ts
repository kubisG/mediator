import { Inject, Module, OnModuleDestroy } from "@nestjs/common";

import { loggerFactory, remoteLoggingGateway } from "./logger/logger.provider";
import { LoggerService } from "./logger/logger.service";
import { Mailer } from "./mailer/providers/mailer.interface";
import { mailerFactory } from "./mailer/mailer.provider";
import { SessionStore } from "./sessions/providers/session-store.interface";
import { databaseProviders, EntityProviders } from "./db/db.provider";
import { sessionStoreFactory } from "./sessions/sessions.provider";
import { EnvironmentsModule } from "@ra/web-env-be/environments.module";
import { DbService } from "./db/db.service";
import { clientProxyProviders } from "./client-proxy.provider";
import { MessageValidatorService } from "./validators/message-validator.service";
import { PreferencesService } from "./preferences.service";
import { fastRandomFactory } from "./core.provider";
import { HttpCacheService } from "./http-cache.service";

@Module({
    imports: [
        EnvironmentsModule,
    ],
    controllers: [],
    providers: [
        loggerFactory,
        mailerFactory,
        sessionStoreFactory,
        ...remoteLoggingGateway,
        LoggerService,
        ...databaseProviders,
        ...EntityProviders,
        DbService,
        ...clientProxyProviders,
        MessageValidatorService,
        PreferencesService,
        HttpCacheService,
        fastRandomFactory,
    ],
    exports: [
        loggerFactory,
        mailerFactory,
        sessionStoreFactory,
        LoggerService,
        ...databaseProviders,
        ...EntityProviders,
        DbService,
        ...clientProxyProviders,
        MessageValidatorService,
        PreferencesService,
        HttpCacheService,
        fastRandomFactory,
    ]
})
export class CoreModule implements OnModuleDestroy {

    constructor(
        @Inject("sessions") private sessions: SessionStore,
        @Inject("mailer") private mailer: Mailer,
    ) { }

    onModuleDestroy() {
        this.sessions.close();
        this.mailer.close();
    }

}
