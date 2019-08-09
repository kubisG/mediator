import { Injectable } from "@angular/core";
import { LayoutMenuItemsService, DockableService, MenuItem, AppHostComponent, LayoutService } from "@ra/web-components";
import { StoreListItem } from "../monitor-core/stores-list/stores-list-item-interface";
import { MonitorDataService } from "../monitor/monitor-data.service";
import { MonitorGridComponent } from "../monitor/monitor-grid/monitor-grid.component";
import { RestAppDirectoryService } from "@ra/web-components";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { Logout } from "@ra/web-core-fe";

@Injectable()
export class MonitorMenuItemsService extends LayoutMenuItemsService {

    private menuInitialized = false;

    constructor(
        private restAppDirectoryService: RestAppDirectoryService,
        private monitorDataService: MonitorDataService,
        private router: Router,
        private store: Store,
        dockableService: DockableService,
    ) {
        super(dockableService);
        this.init();
    }

    private setStoresList(items: StoreListItem[]) {
        const subItems: MenuItem[] = [];
        for (const item of items) {
            item.label = item.name;
            subItems.push({
                label: item.name,
                icon: "save",
                data: {
                    component: MonitorGridComponent,
                    componentName: "ra-monitor-grid",
                    state: item,
                }
            });
        }
        this.menuItems.unshift({
            icon: "storage",
            label: "Stores",
            subItems,
        });
        this.headerMenuItems.next(this.menuItems);
    }

    private setAppDirectory(apps: any) {
        const subItems: MenuItem[] = [];

        for (const app of apps.applications) {
            subItems.push({
                label: app.name,
                data: {
                    appId: app.appId,
                }
            });
        }

        this.menuItems.unshift({
            icon: "apps",
            label: "App Directory",
            subItems,
        });
        this.headerMenuItems.next(this.menuItems);
    }

    private setAppControls() {
        this.menuItems.push({
            icon: "exit_to_app",
            label: "Logout",
        });
        this.headerMenuItems.next(this.menuItems);
    }

    private initStoresList() {
        this.monitorDataService.storesList$.subscribe((data: StoreListItem[]) => {
            this.setStoresList(data);
        });
    }

    private initAppDirectoryList() {
        this.restAppDirectoryService.setHost(environment.apiUrl);
        this.restAppDirectoryService.searchApps({}).then((apps: any) => {
            this.setAppDirectory(apps);
        });
    }

    private init() {
        this.menuItems = [];
        if (!this.menuInitialized) {
            this.initStoresList();
            this.initAppDirectoryList();
            this.setAppControls();
            this.menuInitialized = true;
        }
    }

    public itemActions(item: MenuItem) {
        switch (item.label) {
            case "Logout": {
                this.store.dispatch(new Logout());
                this.router.navigate(["/"]);
                break;
            }
        }
    }

    setComponentList(componentsList: any[], menuItems?: any[], submenu?: string) {

    }

}
