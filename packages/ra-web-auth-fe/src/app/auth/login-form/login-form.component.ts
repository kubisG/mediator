import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Store, Actions, ofActionDispatched } from "@ngxs/store";
import { FormControl, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { DOCUMENT } from "@angular/common";
import { Login, AuthState, Logout, LoginSuccess } from "@ra/web-core-fe";
@Component({
    selector: "ra-login-form",
    templateUrl: "./login-form.component.html",
    styleUrls: ["./login-form.component.less"]
})
export class LoginFormComponent implements OnInit, OnDestroy {

    private transSub;
    private logoutSub;
    private loginSub;

    public appVersion = "";
    public appVersionLong = "";

    public emailField: FormControl = new FormControl("", [Validators.required, Validators.email]);
    public passwordField: FormControl = new FormControl("", [Validators.required]);
    private translations = {};
    public popupVisibleVal = false;

    constructor(
        private store: Store,
        private actions: Actions,
        private translate: TranslateService,
        @Inject(DOCUMENT) private document: any,
    ) { }

    /**
     * Login form
     * @param event Click event
     */
    public login(event) {
        this.store.dispatch(new Login(this.emailField.value, this.passwordField.value));
    }

    private loadTranslations() {
        this.transSub = this.translate.get(["login.error", "login.error.mess"])
            .subscribe((res) => this.translations = res);
    }

    private dispatchLogout() {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token !== null) {
            this.store.dispatch(new Logout());
        }
    }

    private loginAction() {
        this.loginSub = this.actions.pipe(ofActionDispatched(LoginSuccess)).subscribe(() => {

        });
    }

    ngOnInit() {
        this.document.body.classList.add("rapid-body");
        this.loadTranslations();
        this.dispatchLogout();
        this.loginAction();
    }

    ngOnDestroy() {
        if (this.transSub) {
            this.transSub.unsubscribe();
        }
        if (this.logoutSub) {
            this.logoutSub.unsubscribe();
        }

    }

    public popupVisible(event) {
        this.popupVisibleVal = event;
    }

    public forgot(event) {
        this.popupVisibleVal = true;
    }
}
