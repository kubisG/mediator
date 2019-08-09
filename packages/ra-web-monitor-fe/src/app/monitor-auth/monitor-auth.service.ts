import { Injectable } from "@angular/core";
import { Store, Actions, ofActionDispatched } from "@ngxs/store";
import { Subscription } from "rxjs/internal/Subscription";
import { Login, AuthData, LoginSuccess, LoginFailed, SubscriptionManager, SubscriptionManagerCollection } from "@ra/web-core-fe";
import { Credentials } from "@ra/web-auth-fe";
import { Router } from "@angular/router";
import { MonitorRestUsersService } from "../monitor-rest/monitor-rest-users.service";

@Injectable({
    providedIn: "root"
})
export class MonitorAuthService {

    private subscriptions: SubscriptionManagerCollection;

    public loginSuccess: (() => void) = () => {
        this.router.navigate([`/layout`]);
    }

    constructor(
        protected monitorRestUsersService: MonitorRestUsersService,
        protected store: Store,
        protected actions: Actions,
        protected router: Router,
        protected subscriptionManager: SubscriptionManager,
    ) {
        this.subscriptions = this.subscriptionManager.createCollection(this);
    }

    public setAuthData(credentials: Credentials) {
        this.monitorRestUsersService.login(credentials.email, credentials.password).then((data) => {
            if (!data) {
                this.store.dispatch(new LoginFailed({ message: "Auth Failed" }));
                return;
            }
            this.store.dispatch(new AuthData(data));
            this.store.dispatch(new LoginSuccess(data));
        }).catch((err) => {
            this.store.dispatch(new LoginFailed(err));
        });
    }

    public subscribeToLoginAction() {
        this.subscriptions.add = this.actions.pipe(ofActionDispatched(Login)).subscribe((credentials) => {
            this.setAuthData(credentials);
        });
    }

    public subscribeToLoginSuccess() {
        this.subscriptions.add = this.actions.pipe(ofActionDispatched(LoginSuccess)).subscribe(() => {
            this.loginSuccess();
        });
    }

    public subscribeToLoginFailed() {
        this.subscriptions.add = this.actions.pipe(ofActionDispatched(LoginFailed)).subscribe(() => {

        });
    }

    public unsubscribe() {
        this.subscriptions.unsubscribe();
    }

}
