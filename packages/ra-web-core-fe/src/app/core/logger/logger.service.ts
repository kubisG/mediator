import { Injectable } from "@angular/core";
import { Logger } from "./providers/logger";
import { environment } from "../../../environments/environment";
import { loggers } from "./constants";
import { ConsoleLogger } from "./providers/console-logger";
import { VoidLogger } from "./providers/void-logger";
import { WsLogger } from "./providers/ws-logger";
import { Store, Actions } from "@ngxs/store";

@Injectable({
    providedIn: "root",
})
export class LoggerService implements Logger {

    private logger: Logger;

    constructor(
        private store: Store,
        private actions: Actions,
    ) {
        this.init();
    }

    private init(): void {
        switch (environment.logging.provider) {
            case loggers.console: {
                this.logger = new ConsoleLogger();
                break;
            }
            case loggers.void: {
                this.logger = new VoidLogger();
                break;
            }
            case loggers.ws: {
                this.logger = new WsLogger(this.store, this.actions);
                break;
            }
            default: {
                this.logger = new VoidLogger();
                break;
            }
        }
    }

    public error(msg: any): void {
        this.logger.error(msg);
    }

    public warn(msg: any): void {
        this.logger.warn(msg);
    }

    public info(msg: any): void {
        this.logger.info(msg);
    }

    public verbose(msg: any): void {
        this.logger.verbose(msg);
    }

    public debug(msg: any): void {
        this.logger.debug(msg);
    }

    public silly(msg: any): void {
        this.logger.silly(msg);
    }

    public enableLogging(enabled: boolean): void {
        this.logger.enableLogging(enabled);
    }
}
