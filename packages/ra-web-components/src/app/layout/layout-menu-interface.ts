import { MenuItem } from "../header/menu-item.interface";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs/internal/Observable";
import { ButtonItem } from "../header/button-item.interface";

export interface LayoutMenuInterface {

    headerButtonItems: BehaviorSubject<ButtonItem[]>;
    headerButtonItems$: Observable<ButtonItem[]>;

    headerMenuItems: BehaviorSubject<MenuItem[]>;
    headerMenuItems$: Observable<MenuItem[]>;

    headerLeftMenuItems: BehaviorSubject<MenuItem[]>;
    headerLeftMenuItems$: Observable<MenuItem[]>;


    setComponentList(componentsList: any[], menuItems?: any[], submenu?: string);

    addLeftMenuItem(item: MenuItem);
    removeFromLeftMenu(item: MenuItem);

    addButtonItem(button: ButtonItem);
    setButtonItems(buttons: ButtonItem[]);

}
