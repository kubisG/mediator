import { MenuItem } from "../header/menu-item.interface";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { Observable } from "rxjs/internal/Observable";
import { ButtonItem } from "../header/button-item.interface";
import { Type } from "@angular/core";
import { LayoutRightsConfig } from "./decorators/layout-rights-config.interface";

export interface LayoutMenuInterface {

    headerButtonItems: ReplaySubject<ButtonItem[]>;
    headerButtonItems$: Observable<ButtonItem[]>;

    headerMenuItems: ReplaySubject<MenuItem[]>;
    headerMenuItems$: Observable<MenuItem[]>;

    headerLeftMenuItems: ReplaySubject<MenuItem[]>;
    headerLeftMenuItems$: Observable<MenuItem[]>;


    setComponentList(componentsList: any[], menuItems?: any[], submenu?: string);

    addLeftMenuItem(item: MenuItem);
    removeFromLeftMenu(item: MenuItem);

    addButtonItem(button: ButtonItem);
    setButtonItems(buttons: ButtonItem[]);

    getLayoutRightsConfig(component: Type<any>): LayoutRightsConfig;

    unsubscribeAll();
}
