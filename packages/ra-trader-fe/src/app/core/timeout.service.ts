import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";
import { Toast, BodyOutputType } from "angular2-toaster";
import { DatePipe } from "@angular/common";

import { environment } from "../../environments/environment";
import { NotifyService } from "./notify/notify.service";
import { LoggerService } from "./logger/logger.service";
import { AuthState } from "./authentication/state/auth.state";
import { Logout } from "./authentication/state/auth.actions";

@Injectable({
    providedIn: "root",
})
export class TimeoutService {

    constructor(private store: Store,
        private idle: Idle,
        private toasterService: NotifyService,
        private datePipe: DatePipe,
        private logger: LoggerService,
    ) { }

    /**
     * TODO : split method
     */
    startTimeout() {
        // IDLE PART
        this.idle.setIdle(environment.loginIdle);
        // sets a timeout period of 10 seconds. after 20 seconds of inactivity, the user will be considered timed out.
        this.idle.setTimeout(environment.loginTimeout);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        this.idle.onTimeout.subscribe(() => {
            this.logger.info(`TIMEOUT, ${environment.loginTimeout}`);
            const token = this.store.selectSnapshot(AuthState.getToken);
            if (token === null) {
            } else {
                this.logger.info(`LOGOUT`);
                this.store.dispatch(new Logout());
            }
        });
        this.idle.onIdleStart.subscribe(() => {
            this.logger.info(`IDLE, ${environment.loginIdle}`);
            const token = this.store.selectSnapshot(AuthState.getToken);
            if (token === null) {
            } else {
                const today = Date.now();
                const toast: Toast = {
                    type: "warning",
                    title: "Timeout",
                    bodyOutputType: BodyOutputType.TrustedHtml,
                    body: this.datePipe.transform(today, "hh:mm:ss") + `<br>You will be logout in ${environment.loginTimeout}s...`,
                    timeout: (environment.loginTimeout * 1000)
                };

                this.toasterService.pop(toast);
            }
        });
        this.reset();
    }

    reset() {
        this.idle.watch();
    }

}
