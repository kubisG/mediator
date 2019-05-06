import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { Router, NavigationEnd } from "@angular/router";
import { TimeoutService } from "./timeout.service";
import { AuthState } from "./authentication/state/auth.state";

@Injectable({
    providedIn: "root",
})
export class CoreService {

    private timeoutInitialized = false;

    constructor(
        private store: Store,
        private router: Router,
        private timeoutService: TimeoutService,
    ) {
        this.init();
    }

    private init() {
        this.router.events.subscribe((data) => {
            if (data instanceof NavigationEnd) {
                this.initTimeout();
            }
        });
    }

    private initTimeout() {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token !== null && !this.timeoutInitialized) {
            this.timeoutService.startTimeout();
            this.timeoutInitialized = true;
        }
    }

}
