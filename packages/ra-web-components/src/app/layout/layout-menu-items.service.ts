import { Injectable, Type } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs/internal/Observable";
import { MenuItem } from "../header/menu-item.interface";
import { DockableService } from "../dockable/dockable.service";
import { DockableConfig } from "../dockable/decorators/dockable-config.interface";
import { ButtonItem } from "../header/button-item.interface";
import { LayoutMenuInterface } from "./layout-menu-interface";
import { LAYOUTRIGHTS_CONFIG } from "./decorators/layout-rights.decorators";
import { Reflect } from "core-js";
import { LayoutRightsConfig } from "./decorators/layout-rights-config.interface";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { UserInfo } from "../header/user-info.interface";

@Injectable()
export class LayoutMenuItemsService implements LayoutMenuInterface {

    protected menuItems: MenuItem[] = [
    ];

    protected leftMenuItems: MenuItem[] = [
        {
            label: "New Layout",
            icon: "add",
        },
        {
            label: "Delete Layout",
            icon: "delete"
        }
    ];

    protected buttonItems: ButtonItem[] = [
    ];

    public headerButtonItems: ReplaySubject<ButtonItem[]> = new ReplaySubject<ButtonItem[]>(1);
    public headerButtonItems$: Observable<ButtonItem[]> = this.headerButtonItems.asObservable();

    public headerMenuItems: ReplaySubject<MenuItem[]> = new ReplaySubject<MenuItem[]>(1);
    public headerMenuItems$: Observable<MenuItem[]> = this.headerMenuItems.asObservable();

    public headerLeftMenuItems: ReplaySubject<MenuItem[]> = new ReplaySubject<MenuItem[]>(1);
    public headerLeftMenuItems$: Observable<MenuItem[]> = this.headerLeftMenuItems.asObservable();

    public user: ReplaySubject<UserInfo> = new ReplaySubject<UserInfo>(1);
    public user$: Observable<UserInfo> = this.user.asObservable();

    public alertMessage: ReplaySubject<string> = new ReplaySubject<string>(1);
    public alertMessage$: Observable<string> = this.alertMessage.asObservable();

    public appSettings: ReplaySubject<any> = new ReplaySubject<any>(1);
    public appSettings$: Observable<any> = this.appSettings.asObservable();

    public app;
    public submenu;

    constructor(
        protected dockableService: DockableService,
    ) {
        this.setInitValues();
    }

    setInitValues() {
        this.headerMenuItems.next(this.menuItems);
        this.headerLeftMenuItems.next(this.leftMenuItems);
        this.headerButtonItems.next(this.buttonItems);
    }

    public setComponentList(componentsList: any[], menuItems?: any[], submenu?: string) {
        this.submenu = submenu;
        this.menuItems = [];

        const length = menuItems ? menuItems.length : 1;

        for (let i = 0; i < length; i++) {
            if (!menuItems || !submenu || menuItems[i].label === submenu) {
                if (menuItems && menuItems[i]) {
                    this.menuItems.push(menuItems[i]);
                }
                this.menuItems.push({
                    label: "",
                    divider: true,
                });
                for (const component of componentsList) {
                    const componentConfig: DockableConfig = this.dockableService.getComponentConfig(component.component);
                    this.menuItems.push({
                        label: component.state && component.state.label ?
                            component.state.label : componentConfig.label ? componentConfig.label : component.componentName,
                        icon: componentConfig.icon ? componentConfig.icon : undefined,
                        data: component,
                        single: componentConfig.single ? componentConfig.single : undefined,
                        class: "submenu",
                    });
                }
                this.menuItems.push({
                    label: "",
                    divider: true,
                });
            } else if (menuItems && menuItems[i]) {
                this.menuItems.push(menuItems[i]);
            }
        }
        this.menuItems.push(
            {
                label: "Logout",
                icon: "exit_to_app",
            });
        this.headerMenuItems.next(this.menuItems);
    }

    public setApp(version, versionLong) {
        this.appSettings.next({ version, versionLong, submenu: this.submenu });
    }

    public addLeftMenuItem(item: MenuItem) {
        this.leftMenuItems.push(item);
        this.headerLeftMenuItems.next(this.leftMenuItems);
    }

    public removeFromLeftMenu(item: MenuItem) {
        this.leftMenuItems.forEach((value, i) => {
            if (item.label === value.label) {
                this.leftMenuItems.splice(i, 1);
                return false;
            }
        });
    }

    public addButtonItem(button: ButtonItem) {
        this.buttonItems.push(button);
        this.headerButtonItems.next(this.buttonItems);
    }

    public setButtonItems(buttons: ButtonItem[]) {
        this.headerButtonItems.next(buttons);
    }

    public getLayoutRightsConfig(component: Type<any>): LayoutRightsConfig {
        return Reflect.getMetadata(LAYOUTRIGHTS_CONFIG, component);
    }

    public setUser(user) {
        this.user.next(user);
    }

    public setAlertMessage(alertMessage) {
        this.alertMessage.next(alertMessage);
    }

    public unsubscribeAll() {
    }
}
