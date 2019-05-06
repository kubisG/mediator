import { NgModule, SkipSelf, Optional } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AuthService } from "./authentication/auth.service";
import { LoggerService } from "./logger/logger.service";
import { CorsInterceptor } from "./http/cors.interceptor";
import { AuthGuard } from "./authentication/auth.guard";
import { JwtInterceptor } from "./http/jwt.interceptor";
import { StatusWSService } from "./websocket/services/status-ws.service";
import { UsersService } from "./users.service";
import { NotifyService } from "./notify/notify.service";
import { MoneyService } from "./money/money.service";
import { HitlistSettingsService } from "./hitlist-settings/hitlist-settings.service";
import { TimeoutService } from "./timeout.service";
import { CoreService } from "./core.service";
import { SoundService } from "./sound.service";
import { ModuleGuard } from "./guards/module.guard";
import { CacheMapService } from "./cache/cache-map.service";
import { CacheInterceptor } from "./http/cache.interceptor";
import { Cache } from "./cache/cache";
import { UIDService } from "./uid.service";
import { HubService } from "./hub.service";

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    declarations: [
    ],
    exports: [
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CorsInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
        { provide: Cache, useClass: CacheMapService },
        CacheMapService,
        LoggerService,
        AuthService,
        AuthGuard,
        ModuleGuard,
        DatePipe,
        StatusWSService,
        UsersService,
        HubService,
        NotifyService,
        MoneyService,
        HitlistSettingsService,
        TimeoutService,
        CoreService,
        SoundService,
        UIDService,
    ]
})
export class CoreModule {
    constructor(
        @Optional() @SkipSelf() parentModule: CoreModule,
        private coreService: CoreService,
        private soundService: SoundService,
    ) {
        if (parentModule) {
            throw new Error(
                "CoreModule is already loaded. Import it in the AppModule only");
        }
    }
}
