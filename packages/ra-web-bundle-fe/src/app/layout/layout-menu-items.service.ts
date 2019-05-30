import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { MenuItem, DockableService, DockableConfig } from "@ra/web-components";
import { Observable } from "rxjs/internal/Observable";
import { RestUsersService } from "../rest/rest-users.service";
import { Store } from "@ngxs/store";
import { Router } from "@angular/router";
import { LogoutSuccess } from "@ra/web-core-fe";
import { componentsList } from "../components-list";

@Injectable()
export class LayoutMenuItemsService {

    private menuItems: MenuItem[] = [
        {
            label: "Logout",
            icon: "exit_to_app",
        }
    ];

    public headerMenuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.menuItems);
    public headerMenuItems$: Observable<MenuItem[]> = this.headerMenuItems.asObservable();

    constructor(
        private dockableService: DockableService,
        private restUsersService: RestUsersService,
        private store: Store,
        private router: Router,
    ) {
        this.init();
    }

    private init() {
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
            });
        }
    }

    private logout() {
        this.restUsersService.logout().then((data) => {
            this.store.dispatch(new LogoutSuccess(data));
            this.router.navigateByUrl(`/`);
        });
    }

    private monitor() {
        this.router.navigateByUrl(`/layout`);
    }

    private addComponentToLayout(component: any) {
        this.dockableService.addComponent({
            label: component.componentName,
            componentName: component.componentName,
            component: component.component,
        });
    }

    public doMenuItemAction(item: MenuItem) {
        switch (item.label) {
            case "Logout": {
                this.logout();
                break;
            }
            case "Monitor": {
                this.monitor();
                break;
            }
            default: {
                this.addComponentToLayout(item.data);
                break;
            }
        }
    }

}
