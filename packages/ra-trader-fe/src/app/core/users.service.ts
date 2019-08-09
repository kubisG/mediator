import { WebSocketService } from "./websocket/services/websocket.service";
import { Injectable } from "@angular/core";
import { WebSocketSetup, WebSocketEvent } from "./websocket/decorators/websocket-service.decorator";
import { LoggerService } from "./logger/logger.service";
import { Store, Actions } from "@ngxs/store";
import { EnableLogging } from "../preferences/state/preferences.action";
import { CacheMapService } from "./cache/cache-map.service";

@WebSocketSetup({ namespace: "users" })
@Injectable({
    providedIn: "root",
})
export class UsersService extends WebSocketService {

    private store: Store;

    constructor(
        store: Store,
        private loggerService: LoggerService,
        private cacheMapService: CacheMapService,
        actions: Actions,
    ) {
        super(true, actions, store, true);
        this.store = store;
        this.init();
    }

    private init() {
        this.socketConnected$.subscribe((connected) => {
            if (connected) {
                this.emit("init", {});
            }
        });
    }

    public enableLogging(enabled: boolean) {
        this.loggerService.enableLogging(enabled);
    }

    @WebSocketEvent("switchLogging")
    public onEnable(enabled: any) {
        this.loggerService.enableLogging(enabled.enabled);
        this.store.dispatch(new EnableLogging());
        this.loggerService.info(`LOGGING ENABLED: ${enabled.enabled}`);
    }

    @WebSocketEvent("clearCache")
    public onClearCache(enabled: any) {
        this.cacheMapService.clearCache();
        this.loggerService.info(`CACHED CLEARED: ${enabled}`);
    }
}
