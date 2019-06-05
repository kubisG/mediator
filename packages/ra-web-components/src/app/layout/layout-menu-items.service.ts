import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs/internal/Observable";
import { MenuItem } from "../header/menu-item.interface";
import { DockableService } from "../dockable/dockable.service";
import { DockableConfig } from "../dockable/decorators/dockable-config.interface";

@Injectable()
export class LayoutMenuItemsService {

    private menuItems: MenuItem[] = [
        {
            label: "Logout",
            icon: "exit_to_app",
        }
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

    public headerMenuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.menuItems);
    public headerMenuItems$: Observable<MenuItem[]> = this.headerMenuItems.asObservable();

    public headerLeftMenuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.leftMenuItems);
    public headerLeftMenuItems$: Observable<MenuItem[]> = this.headerLeftMenuItems.asObservable();

    constructor(
        private dockableService: DockableService,
    ) { }

    public setComponentList(componentsList: any[]) {
        this.menuItems.unshift({
            label: "",
            divider: true,
        });
        for (const component of componentsList) {
            const componentConfig: DockableConfig = this.dockableService.getComponentConfig(component.component);
            this.menuItems.unshift({
                label: componentConfig.label ? componentConfig.label : component.componentName,
                icon: componentConfig.icon ? componentConfig.icon : undefined,
                data: component,
                single: componentConfig.single ? componentConfig.single : undefined,
            });
        }
        this.headerLeftMenuItems.next(this.menuItems);
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

}
