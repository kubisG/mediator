import { Component, OnInit, HostBinding, Inject, OnDestroy, ComponentFactoryResolver, ApplicationRef, Injector } from "@angular/core";
import { Store, Actions, ofActionDispatched } from "@ngxs/store";
import { DOCUMENT } from "@angular/common";
import { Subscription } from "rxjs/internal/Subscription";
import { MatDialog } from "@angular/material";

import { NotifyService } from "../../core/notify/notify.service";
import { PreferencesState } from "../../preferences/state/preferences.state";
import { PreferencesModel } from "../../preferences/state/preferences.model";
import { AuthState } from "../../core/authentication/state/auth.state";
import { SavePreferences, SavePreferencesSuccess, SavePreferencesError } from "../../preferences/state/preferences.action";
import { RestUsersService } from "../../rest/rest-users.service";
import { DialogCurrencyComponent } from "../dialog-currency/dialog-currency.component";
import { MoneyService } from "../../core/money/money.service";
import { RestInputRulesService } from "../../rest/rest-input-rules.service";
import { LoggerService } from "../../core/logger/logger.service";
import { LayoutRights, Dockable, DockableComponent, DockableHooks } from "@ra/web-components";

@LayoutRights({})
@Dockable({
    label: "User",
    icon: "perm_identity",
})
@Component({
    selector: "ra-settings",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.less"]
})
export class SettingsComponent extends DockableComponent implements OnInit, DockableHooks {

    collapsed: boolean;
    public lists = {};

    public user: any;
    public prefs: PreferencesModel;
    public prefState: PreferencesModel;

    public onSettInit = false;
    private saveSuccessSub: Subscription;
    private saveErrorSub: Subscription;
    public app = 1;

    constructor(
        private usersService: RestUsersService,
        private store: Store,
        private actions: Actions,
        private toasterService: NotifyService,
        private listsService: RestInputRulesService,
        private moneyService: MoneyService,
        @Inject(DOCUMENT) private document: any,
        public dialog: MatDialog,
        private logger: LoggerService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
    }

    private loadLists() {
        this.listsService.getInputRules().then(
            (data) => {
                data = data.sort((a, b) => a.name.localeCompare(b.name));
                for (let i = 0; i < data.length; i++) {
                    if (!this.lists[data[i].label]) {
                        this.lists[data[i].label] = [];
                    }
                    this.lists[data[i].label].push({ name: data[i].name, value: data[i].value });
                }
            })
            .catch((error) => {
                this.logger.error(error);
                this.lists = [];
            });
    }

    private loadUsers() {
        this.usersService.getUser(this.store.selectSnapshot(AuthState.getUser).id).then(
            (data) => {
                this.user = data;
                this.onSettInit = true;
            })
            .catch((error) => {
                this.user = {};
                this.onSettInit = true;
            });
    }

    onSetTheme(theme) {
        this.document.body.classList.remove("indigo-pink",
            "deeppurple-amber", "pink-bluegrey", "purple-green", "deeporange-brown", "green-orange");
        this.document.body.classList.add(theme);
        this.prefs.theme = theme;
    }

    ngOnInit() {
        this.loadLists();
        this.loadUsers();
        this.app = this.store.selectSnapshot(AuthState.getApp);
        this.prefState = this.store.selectSnapshot(PreferencesState.getPrefs);
        this.prefs = { ...this.prefState };
        this.saveSuccessSub = this.actions.pipe(ofActionDispatched(SavePreferencesSuccess)).subscribe(() => {
            this.moneyService.setTransfers(null, this.prefs.currency);
            this.toasterService.pop("info", "Settings successfully updated");
        });
        this.saveErrorSub = this.actions.pipe(ofActionDispatched(SavePreferencesError)).subscribe((err) => {
            this.toasterService.pop("error", "Database error", err.error.message);
        });
    }

    dockableClose(): Promise<void> {
        if (this.saveErrorSub) {
            this.saveErrorSub.unsubscribe();
        }
        if (this.saveSuccessSub) {
            this.saveSuccessSub.unsubscribe();
        }
        return Promise.resolve();
    }
    dockableShow() {
    }
    dockableTab() {
    }
    dockableHide() {
    }

    saveData() {
        this.user.password = null;
        this.usersService.saveUser(this.user);
        this.store.dispatch(new SavePreferences(this.prefs));
    }

    settCurrency(currency) {
        const dialogRef = this.dialog.open(DialogCurrencyComponent, {
            width: "300px",
            data: { lists: this.lists, currency: currency, actCurrency: this.prefState.currency }
        });
    }

    compareObjects(o1: any, o2: any): boolean {
        return o1.value === o2.value;
    }

    clearColor(evt) {
        this.prefs.rowColors[evt] = null;
    }

}
