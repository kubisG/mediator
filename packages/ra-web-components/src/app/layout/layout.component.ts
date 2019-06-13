import { Component, OnInit, Inject, OnDestroy, Input } from "@angular/core";
import { LayoutMenuItemsService } from "./layout-menu-items.service";
import { Observable } from "rxjs/internal/Observable";
import { LayoutService } from "./layout.service";
import { Subscription } from "rxjs/internal/Subscription";
import { GoldenLayoutStateStore } from "@embedded-enterprises/ng6-golden-layout";
import { LayoutStateStorage } from "./layout-state-storage.interface";
import { MenuItem } from "../header/menu-item.interface";
import { ImgButton } from "../header/img-button.interface";
import { UserInfo } from "../header/user-info.interface";
import { ButtonItem } from "../header/button-item.interface";

@Component({
    selector: "ra-layout",
    templateUrl: "./layout.component.html",
    styleUrls: ["./layout.component.less"]
})
export class LayoutComponent implements OnInit, OnDestroy {

    @Input() logoUrl: string;
    @Input() logoImg: string;
    @Input() appVersion: string;
    @Input() appVersionLong: string;
    @Input() appLabel: string;
    @Input() alertMessage: string;
    @Input() user: UserInfo;

    public headerMenuItems: Observable<MenuItem[]>;
    public headerLeftMenuItems: Observable<MenuItem[]>;
    public buttonItems: Observable<ButtonItem[]>;
    public reload = true;
    public subTitle = "";

    public reloadSub: Subscription;
    public layoutNameSub: Subscription;

    constructor(
        @Inject(GoldenLayoutStateStore) private stateStore: LayoutStateStorage,
        private layoutMenuItemsService: LayoutMenuItemsService,
        private layoutService: LayoutService,
    ) { }

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

    public onMenuItemClick(item: MenuItem): void {
        this.layoutService.doMenuItemAction(item);
    }

    public ngOnInit(): void {
        this.headerMenuItems = this.layoutMenuItemsService.headerMenuItems$;
        this.headerLeftMenuItems = this.layoutMenuItemsService.headerLeftMenuItems$;
        this.buttonItems = this.layoutMenuItemsService.headerButtonItems$;

        this.layoutService.loadSavedLayoutsNames();
        this.layoutReloadSubscribe();
        this.layoutNameSubscribe();
    }

    public ngOnDestroy(): void {
        if (this.reloadSub) {
            this.reloadSub.unsubscribe();
        }
        if (this.layoutNameSub) {
            this.layoutNameSub.unsubscribe();
        }
    }
}
