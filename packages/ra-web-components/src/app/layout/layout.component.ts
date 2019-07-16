import { Component, OnInit, Inject, OnDestroy, Input } from "@angular/core";
import { LayoutMenuItemsService } from "./layout-menu-items.service";
import { Observable } from "rxjs/internal/Observable";
import { LayoutService } from "./layout.service";
import { Subscription } from "rxjs/internal/Subscription";
import { GoldenLayoutStateStore } from "@embedded-enterprises/ng6-golden-layout";
import { LayoutStateStorage } from "./layout-state-storage.interface";
import { MenuItem } from "../header/menu-item.interface";
import { UserInfo } from "../header/user-info.interface";
import { ButtonItem } from "../header/button-item.interface";


@Component({
    selector: "ra-layout",
    templateUrl: "./layout.component.html",
    styleUrls: ["./layout.component.less"]
})
export class LayoutComponent implements OnInit, OnDestroy {

    public headerMenuItems: Observable<MenuItem[]>;
    public headerLeftMenuItems: Observable<MenuItem[]>;
    public buttonItems: Observable<ButtonItem[]>;
    public user: UserInfo;
    public alertMessage: string;
    public appVersion: string;
    public appVersionLong: string;

    public reload = true;
    public subTitle = "";
    public defaultLayout = "";
    public appLabel: string;
    public treeItems: boolean;

    public reloadSub: Subscription;
    public layoutNameSub: Subscription;
    public defaultNameSub: Subscription;
    public appSettSub: Subscription;
    public userSub: Subscription;
    public alertSub: Subscription;

    @Input() logoUrl: string = "https://rapidaddition.com/";
    @Input() logoImg: string = "assets/img/jira-favicon-scaled_t.png";

    @Input() expansionMenuLeft;
    @Input() expansionMenuRight;

    @Input() layoutOn: boolean = true;

    constructor(
        @Inject(GoldenLayoutStateStore) private stateStore: LayoutStateStorage,
        private layoutMenuItemsService: LayoutMenuItemsService,
        private layoutService: LayoutService,
    ) {

    }

    private layoutReloadSubscribe() {
        this.reloadSub = this.layoutService.layoutReload$.subscribe((reload) => {
            this.reload = reload;
        });
    }

    private layoutNameSubscribe() {
        this.layoutNameSub = this.stateStore.activeLayout().subscribe((name) => {
            this.subTitle = name;
        });
    }

    private layoutDefaultSubscribe() {
        this.defaultNameSub = this.stateStore.defaultLayout().subscribe((name) => {
            this.defaultLayout = name;
        });
    }

    public onMenuItemClick(item: MenuItem): void {
        this.layoutService.doMenuItemAction(item);
    }

    public ngOnInit(): void {
        this.headerMenuItems = this.layoutMenuItemsService.headerMenuItems$;
        this.headerLeftMenuItems = this.layoutMenuItemsService.headerLeftMenuItems$;
        this.buttonItems = this.layoutMenuItemsService.headerButtonItems$;
        this.userSub = this.layoutMenuItemsService.user$.subscribe((data) => {
            this.user = data;
        });
        this.alertSub = this.layoutMenuItemsService.alertMessage$.subscribe((data) => {
            this.alertMessage = data;
        });
        this.appSettSub = this.layoutMenuItemsService.appSettings$.subscribe((data) => {
            this.appVersion = data["version"];
            this.appVersionLong = data["versionLong"];
            this.appLabel = data["submenu"];
        });

        this.layoutService.loadSavedLayoutsNames();
        this.layoutReloadSubscribe();
        this.layoutNameSubscribe();
        this.layoutDefaultSubscribe();
    }

    public ngOnDestroy(): void {
        if (this.reloadSub) {
            this.reloadSub.unsubscribe();
        }
        if (this.layoutNameSub) {
            this.layoutNameSub.unsubscribe();
        }
        if (this.defaultNameSub) {
            this.defaultNameSub.unsubscribe();
        }
        if (this.appSettSub) {
            this.appSettSub.unsubscribe();
        }
        if (this.userSub) {
            this.userSub.unsubscribe();
        }
        if (this.alertSub) {
            this.alertSub.unsubscribe();
        }
        this.layoutMenuItemsService.unsubscribeAll();
        this.layoutService.removeAll();
    }
}
