import { Component, OnInit, OnDestroy, ComponentFactoryResolver, Injector, ApplicationRef } from "@angular/core";
import { RestUsersService } from "../../rest/rest-users.service";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { CustomValidators } from "ng2-validation";
import { NotifyService } from "../../core/notify/notify.service";
import { TranslateService } from "@ngx-translate/core";
import { AuthState } from "../../core/authentication/state/auth.state";
import { Store } from "@ngxs/store";
import { LoggerService } from "../../core/logger/logger.service";
import { DockableComponent, LayoutRights, Dockable, DockableHooks } from "@ra/web-components";

@LayoutRights({})
@Dockable({
    label: "Password",
    icon: "vpn_key",
})
@Component({
    selector: "ra-password-change",
    templateUrl: "./password-change.component.html",
    styleUrls: ["./password-change.component.less"]
})
export class PasswordChangeComponent extends DockableComponent implements OnInit, DockableHooks {
    private transSub;
    public newpasswordField: FormControl = new FormControl("", [Validators.required, Validators.minLength(8)]);
    public newpasswordField2: FormControl = new FormControl("", [Validators.required, Validators.minLength(8)
        , CustomValidators.equalTo(this.newpasswordField)]);

    collapsed: boolean;
    private translations = {};

    constructor(
        private restUsersService: RestUsersService,
        private translate: TranslateService,
        private store: Store,
        private toasterService: NotifyService,
        private logger: LoggerService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
    }

    ngOnInit() {
        this.transSub = this.translate.get(["pass.updated"])
            .subscribe((res) => this.translations = res);
    }

    dockableClose(): Promise<void> {
        if (this.transSub) {
            this.transSub.unsubscribe();
        }

        return Promise.resolve();
    }
    dockableShow() {
    }
    dockableTab() {
    }
    dockableHide() {
    }

    savePass() {
        const user = {};
        user["id"] = this.store.selectSnapshot(AuthState.getUser).id;
        user["password"] = this.newpasswordField.value;
        this.restUsersService.saveUser(user).then(
            () => {
                this.toasterService.pop("info", this.translations["pass.updated"]);
            })
            .catch((error) => {
                this.logger.error(error);
                this.toasterService.pop("error", "Database error", error.error.message);
            });
    }
}
