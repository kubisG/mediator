import { Injectable } from "@angular/core";
import { LayoutMenuItemsService, RestAppDirectoryService, DockableService, MenuItem } from "@ra/web-components";

@Injectable()
export class LauncherMenuItemsService extends LayoutMenuItemsService {

    constructor(
        dockableService: DockableService,
    ) {
        super(dockableService);
        this.init();
    }

    private init() {
        this.menuItems = [];
        this.setStoresList([{
            icon: "view_list",
            label: "List of Rules",
            appId: "ra.platform.forms.grid"
        }
         , {
            icon: "visibility",
            label: "Detail",
            appId: "ra.platform.forms.detail"
         }]);
    }

    private setStoresList(items: any[]) {
        this.menuItems = [];
        for (const item of items) {
            item.label = item.name;
            this.menuItems.push({
                label: item.name,
                icon: item.icon,
                data: {
                    appId: item.appId,
                    item,
                }
            });
        }
        this.headerMenuItems.next(this.menuItems);
    }

    setComponentList(componentsList: any[], menuItems?: any[], submenu?: string) {

    }

}
