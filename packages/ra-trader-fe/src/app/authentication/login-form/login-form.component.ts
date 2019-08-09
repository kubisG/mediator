import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Store, Actions, ofActionDispatched } from "@ngxs/store";
import { Router } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { DOCUMENT } from "@angular/common";
import { MatDialog } from "@angular/material";
import { Login, LoginSuccess, Logout, LoginFailed, LogoutSuccess } from "../../core/authentication/state/auth.actions";
import { AuthState } from "../../core/authentication/state/auth.state";
import { NotifyService } from "../../core/notify/notify.service";
import { environment } from "../../../environments/environment";
import { TimeoutService } from "../../core/timeout.service";
import { AppType } from "@ra/web-shared-fe";
import { LostPasswordComponent } from "../lost-password/lost-password.component";

@Component({
    selector: "ra-login-form",
    templateUrl: "./login-form.component.html",
    styleUrls: ["./login-form.component.less"]
})
export class LoginFormComponent implements OnInit, OnDestroy {

    private transSub;
    private loginSub;
    private logoutSub;

    public appVersion = "";
    public appVersionLong = "";

    public emailField: FormControl = new FormControl("", [Validators.required, Validators.email]);
    public passwordField: FormControl = new FormControl("", [Validators.required]);
    private translations = {};

    constructor(
        private store: Store,
        private actions: Actions,
        private router: Router,
        private toasterService: NotifyService,
        private translate: TranslateService,
        public dialog: MatDialog,
        @Inject(DOCUMENT) private document: any
    ) {}

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
            this.toasterService.clear();
            this.document.body.classList.remove("rapid-body");

            const theme = this.store.selectSnapshot(AuthState.getTheme);
            this.document.body.classList.add(theme);

            if (this.store.selectSnapshot(AuthState.getRole) === "ADMIN") {
                this.router.navigate(["/admin/"]);
            } else {
                if (this.store.selectSnapshot(AuthState.getApp) === AppType.Broker) {
                    this.router.navigate(["/broker/"]);
                } else {
                    this.router.navigate(["/trader/"]);
                }
            }
        });
    }

    ngOnInit() {
        this.document.body.classList.add("rapid-body");
        this.loadTranslations();
        this.dispatchLogout();
        this.loginAction();
        this.logoutSub = this.actions.pipe(ofActionDispatched(LoginFailed)).subscribe((eee) => {
            this.toasterService.pop("error", this.translations["login.error"], this.translations["login.error.mess"]);
        });
        this.appVersion = environment.version;
        this.appVersionLong = environment.versionLong;
    }

    ngOnDestroy() {
        if (this.transSub) {
            this.transSub.unsubscribe();
        }
        if (this.loginSub) {
            this.loginSub.unsubscribe();
        }
        if (this.logoutSub) {
            this.logoutSub.unsubscribe();
        }

    }

    public forgot(event) {
        const dialogRef = this.dialog.open(LostPasswordComponent, {
            data: { email: this.emailField.value }
        });

    }
}
