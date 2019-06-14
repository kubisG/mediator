import { Injectable, Type } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs/internal/Observable";
import { MenuItem } from "../header/menu-item.interface";
import { DockableService } from "../dockable/dockable.service";
import { DockableConfig } from "../dockable/decorators/dockable-config.interface";
import { ButtonItem } from "../header/button-item.interface";
import { LayoutMenuInterface } from "./layout-menu-interface";
import { Store } from "@ngxs/store";
import { LAYOUTRIGHTS_CONFIG } from "./decorators/layout-rights.decorators";
import { Reflect } from "core-js";
import { LayoutRightsConfig } from "./decorators/layout-rights-config.interface";

@Injectable()
export class LayoutMenuItemsService implements LayoutMenuInterface {

    private menuItems: MenuItem[] = [
    ];

    private leftMenuItems: MenuItem[] = [
        {
            label: "New Layout",
            icon: "add",
        },
        {
            label: "Delete Layout",
            icon: "delete"
        }
    ];

    private buttonItems: ButtonItem[] = [
    ];

    public headerButtonItems: BehaviorSubject<ButtonItem[]> = new BehaviorSubject<ButtonItem[]>(this.buttonItems);
    public headerButtonItems$: Observable<ButtonItem[]> = this.headerButtonItems.asObservable();

    public headerMenuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.menuItems);
    public headerMenuItems$: Observable<MenuItem[]> = this.headerMenuItems.asObservable();

    public headerLeftMenuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.leftMenuItems);
    public headerLeftMenuItems$: Observable<MenuItem[]> = this.headerLeftMenuItems.asObservable();

    public user;
    public app;

    constructor(
        protected dockableService: DockableService,
    ) {
    }

    public setComponentList(componentsList: any[], menuItems?: any[], submenu?: string) {
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
                        label: componentConfig.label ? componentConfig.label : component.componentName,
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


    public isVisible(roles) {
        return (!roles || (this.user && roles.indexOf(this.user.role) > -1));
    }

    public getLayoutRightsConfig(component: Type<any>): LayoutRightsConfig {
        return Reflect.getMetadata(LAYOUTRIGHTS_CONFIG, component);
    }


}
