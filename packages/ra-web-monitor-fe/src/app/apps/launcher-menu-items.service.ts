import { Injectable } from "@angular/core";
import { LayoutMenuItemsService, RestAppDirectoryService, DockableService, MenuItem } from "@ra/web-components";
import { MonitorDataService } from "../monitor/monitor-data.service";
import { StoreListItem } from "../monitor-core/stores-list/stores-list-item-interface";

@Injectable()
export class LauncherMenuItemsService extends LayoutMenuItemsService {

    constructor(
        private monitorDataService: MonitorDataService,
        dockableService: DockableService,
    ) {
        super(dockableService);
        this.init();
    }

    private init() {
        this.menuItems = [];
        this.initStoresList();
    }

    private setStoresList(items: StoreListItem[]) {
        this.menuItems = [];
        const subItems: MenuItem[] = [];
        for (const item of items) {
            item.label = item.name;
            subItems.push({
                label: item.name,
                icon: "save",
                data: {
                    appId: "ra.test",
                    item,
                }
            });
        }
        this.menuItems.push({
            icon: "storage",
            label: "Stores",
            subItems,
        });
        this.headerMenuItems.next(this.menuItems);
    }

    private initStoresList() {
        this.monitorDataService.storesList$.subscribe((data: StoreListItem[]) => {
            this.setStoresList(data);
        });
    }

    setComponentList(componentsList: any[], menuItems?: any[], submenu?: string) {

    }

}
