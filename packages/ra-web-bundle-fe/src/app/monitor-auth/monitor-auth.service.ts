import { Injectable } from "@angular/core";
import { RestUsersService } from "../rest/rest-users.service";
import { Store, Actions, ofActionDispatched } from "@ngxs/store";
import { Subscription } from "rxjs/internal/Subscription";
import { Login, AuthData, LoginSuccess, LoginFailed } from "@ra/web-core-fe";
import { Credentials } from "@ra/web-auth-fe";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root"
})
export class MonitorAuthService {

    private loginSub: Subscription;
    private loginSuccessSub: Subscription;
    private loginFiledSub: Subscription;

    constructor(
        private restUsersService: RestUsersService,
        private store: Store,
        private actions: Actions,
        private router: Router,
    ) { }

    public setAuthData(credentials: Credentials) {
        this.restUsersService.login(credentials.email, credentials.password).then((data) => {
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
        this.loginSub = this.actions.pipe(ofActionDispatched(Login)).subscribe((credentials) => {
            this.setAuthData(credentials);
        });
    }

    public subscribeToLoginSuccess() {
        this.loginSuccessSub = this.actions.pipe(ofActionDispatched(LoginSuccess)).subscribe(() => {
            this.router.navigateByUrl(`/layout`);
        });
    }

    public subscribeToLoginFailed() {
        this.loginFiledSub = this.actions.pipe(ofActionDispatched(LoginFailed)).subscribe(() => {

        });
    }

    public unsubscribe() {
        if (this.loginSub) {
            this.loginSub.unsubscribe();
        }
        if (this.loginSuccessSub) {
            this.loginSuccessSub.unsubscribe();
        }
        if (this.loginFiledSub) {
            this.loginFiledSub.unsubscribe();
        }
    }

}
