import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Modules } from "../../module/module.enum";
import { Store, ofActionDispatched, Actions } from "@ngxs/store";
import { AuthState } from "../core/authentication/state/auth.state";
import { AuthStateModel } from "../core/authentication/state/auth.model";
import { MenuItem, LayoutMenuItemsService, DockableService, LayoutService } from "@ra/web-components";
import { appHeaderMenuItems } from "./app-menu-list";
import { ButtonItem } from "@ra/web-components";
import { ClearMessagesCount, NewMessagesCount, SetAlertMessage } from "../header/state/header.actions";
import { HeaderState } from "../header/state/header.state";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { NotifyService } from "../core/notify/notify.service";
import { StatusWSService } from "../core/websocket/services/status-ws.service";
import { HubService } from "../core/hub.service";
import { LayoutRightsConfig } from "@ra/web-components";


@Injectable()
export class AppMenuItemsService extends LayoutMenuItemsService {

    private statusSub: Subscription;
    private hubStatusSub: Subscription;
    private newMessagesSub: Subscription;
    private headerAlertMessageSub: Subscription;

    public messageButton: ButtonItem;
    public cloudButton: ButtonItem;
    public wifiButton: ButtonItem;

    public myUser;

    constructor(
        public dockableService: DockableService,
        public store: Store,
        private router: Router,
        private actions: Actions,
        private toasterService: NotifyService,
        private statusWSService: StatusWSService,
        private hubService: HubService,
    ) {
        super(dockableService);
        this.app = this.store.selectSnapshot(AuthState.getApp);
        this.myUser = this.store.selectSnapshot(AuthState.getUser);
        this.setUser(this.myUser);

        this.messageButton = {
            count: 0,
            callBack: this.redirectToOrderStore.bind(this),
            icoTrue: "message",
            icoFalse: "message",
            isTrue: true
        };
        this.cloudButton = {
            count: 0,
            callBack: this.showStatus.bind(this),
            icoTrue: "cloud_queue",
            icoFalse: "cloud_off",
            isTrue: true
        };

        this.wifiButton = {
            count: null,
            callBack: function () { return; },
            icoTrue: "wifi",
            icoFalse: "wifi_off",
            isTrue: true
        };

        this.loadStatus();
        this.loadMessageCount();
        this.loadHubStatus();
        this.subscribeAlertMessage();
    }


    public setAppMenuList(subItems?: any[], submodule?: string) {
        const menuItems: MenuItem[] = [];
        const menuSubItems: MenuItem[] = [];
        for (let i = 0; i < appHeaderMenuItems.length; i++) {
            if (((appHeaderMenuItems[i].modules.indexOf(environment.app) > -1) ||
                ((environment.app === Modules.ALL) && (appHeaderMenuItems[i].modules.indexOf(this.app) > -1 || this.app === Modules.ALL)))
                && (!appHeaderMenuItems[i].roles || this.isVisible(appHeaderMenuItems[i].roles))) {
                menuItems.push({
                    route: appHeaderMenuItems[i].route,
                    icon: appHeaderMenuItems[i].icon,
                    label: appHeaderMenuItems[i].label
                });
            }
        }

        for (let j = 0; j < subItems.length; j++) {
            const componentRights: LayoutRightsConfig = this.getLayoutRightsConfig(subItems[j].component);
            if (
                !componentRights || (this.isVisible(componentRights.roles)
                    && (!componentRights.params && !componentRights["ioi"] || this.isIOI()))
            ) {
                menuSubItems.push(subItems[j]);
            }
        }
        this.setComponentList(menuSubItems, menuItems, submodule);
        this.setApp(environment.version, environment.versionLong);
    }

    isIOI() {
        return this.myUser && this.myUser.appPrefs.ioi;
    }

    public setAppButtonsList() {
        const buttons = [];
        buttons.push(this.messageButton);
        buttons.push(this.cloudButton);
        buttons.push(this.wifiButton);
        this.setButtonItems(buttons);
    }


    showStatus() {
        this.router.navigate(["/diagnostics/"]);
    }

    redirectToOrderStore() {
        this.store.dispatch(new ClearMessagesCount());
        this.router.navigate([this.app === 1 ? "/trader/" : "/broker/"]);
    }

    private loadMessageCount() {
        this.newMessagesSub = this.actions.pipe(ofActionDispatched(NewMessagesCount)).subscribe(() => {
            this.messageButton.count = this.store.selectSnapshot(HeaderState.getNewMessagesCount);
            if (this.messageButton.count > 0) {
                this.messageButton.isTrue = false;
            } else {
                this.messageButton.isTrue = true;
            }
        });
    }

    private loadStatus() {
        this.statusSub = this.statusWSService.getStatusObservable().subscribe((connected) => {
            this.wifiButton.isTrue = connected;
            if (!connected) {
                this.toasterService.pop("error", "WebSocket", "WebSocket connection lost", true, "disconnect");
            } else {
                this.toasterService.pop("success", "WebSocket", "WebSocket connected");
            }
        });
    }

    private subscribeAlertMessage() {
        let alertMessage = this.store.selectSnapshot(HeaderState.getAlertMessage);
        this.setAlertMessage(alertMessage);
        this.headerAlertMessageSub = this.actions.pipe(ofActionDispatched(SetAlertMessage)).subscribe(() => {
            alertMessage = this.store.selectSnapshot(HeaderState.getAlertMessage);
            this.setAlertMessage(alertMessage);
        });
    }

    private loadHubStatus() {
        this.cloudButton.count = this.hubService.getDisconnectedNum();
        this.cloudButton.isTrue = !(this.cloudButton.count > 0);

        this.hubStatusSub = this.hubService.getStatuses().subscribe((connected) => {
            this.toasterService.pop(connected.msg.Text === "UP" ? "success" : "error", "HubStatus", connected.msg.TargetCompID
                + " " + connected.msg.Text);
            this.cloudButton.count = connected.disconnectedNum;
            this.cloudButton.isTrue = !(connected.disconnectedNum > 0);
        });
    }

    public isVisible(roles) {
        return (!roles || (this.myUser && roles.indexOf(this.myUser.role) > -1));
    }

    unsubscribeAll() {
        if (this.statusSub) {
            this.statusSub.unsubscribe();
        }
        if (this.hubStatusSub) {
            this.hubStatusSub.unsubscribe();
        }
        if (this.newMessagesSub) {
            this.newMessagesSub.unsubscribe();
        }
        if (this.headerAlertMessageSub) {
            this.headerAlertMessageSub.unsubscribe();
        }
    }

}

