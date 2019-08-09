import { Injectable } from "@angular/core";
import { LayoutMenuItemsService, DockableService, MenuItem } from "@ra/web-components";
import { HubFormsGridComponent } from "../hub-forms/hub-forms-grid/hub-forms-grid.component";
import { RestAppDirectoryService } from "@ra/web-components";
import { environment } from "../../environments/environment";
import { RestFormsSpecService } from "../rest/forms-rest-spec.service";
import { HubFormsOverviewComponent } from "../hub-forms/hub-forms-overview/hub-forms-overview.component";

@Injectable()
export class FormsMenuItemsService extends LayoutMenuItemsService {

    private initItems: MenuItem[] = [
        {
            label: "Forms",
            icon: "receipt",
            route: "/layout"
        },
        {
            label: "Admin",
            icon: "person",
            route: "/admin"
        },
    ];

    constructor(
        private restAppDirectoryService: RestAppDirectoryService,
        private restFormsSpecService: RestFormsSpecService,
        dockableService: DockableService,
    ) {
        super(dockableService);
    }

    private setStoresList(items: any[]) {
        const subItems = [];
        subItems.push({
            component: HubFormsOverviewComponent,
            componentName: "ra-hub-forms-overview",
         });
        for (const item of items) {
            item.label = item.name;
            item.typ = item.dataType;
            subItems.push({
                    component: HubFormsGridComponent,
                    componentName: "ra-hub-forms-grid",
                    state: item,
            });
        }
        this.setComponentList( subItems, this.initItems, "Forms");
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

        this.menuItems.push({
            icon: "apps",
            label: "App Directory",
            subItems,
        });
        this.headerMenuItems.next(this.menuItems);
    }

    private initStoresList() {
        this.restFormsSpecService.getAllData().then((data) => {
            this.setStoresList(data);
        });
    }

    private initAppDirectoryList() {
        this.restAppDirectoryService.setHost(environment.apiUrl);
        this.restAppDirectoryService.searchApps({}).then((apps: any) => {
            this.setAppDirectory(apps);
        });
    }

    public init(submenu: string) {
        this.submenu = submenu;
        this.menuItems = [];
        this.initStoresList();
        this.initAppDirectoryList();
    }
}
