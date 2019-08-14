import { Inject, Module, OnModuleDestroy } from "@nestjs/common";

import { loggerFactory, remoteLoggingGateway } from "./logger/logger.provider";
import { LoggerService } from "./logger/logger.service";
import { Mailer } from "./mailer/providers/mailer.interface";
import { mailerFactory } from "./mailer/mailer.provider";
import { SessionStore } from "./sessions/providers/session-store.interface";
import { sessionStoreFactory } from "./sessions/sessions.provider";
import { EnvironmentsModule } from "@ra/web-env-be/dist/environments.module";
import { clientProxyProviders } from "./client-proxy.provider";
import { MessageValidatorService } from "./validators/message-validator.service";
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
        ...clientProxyProviders,
        MessageValidatorService,
        HttpCacheService,
        fastRandomFactory,
    ],
    exports: [
        loggerFactory,
        mailerFactory,
        sessionStoreFactory,
        LoggerService,
        ...clientProxyProviders,
        MessageValidatorService,
        HttpCacheService,
        fastRandomFactory,
    ],
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
