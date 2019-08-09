import { Component, OnInit, OnDestroy } from "@angular/core";
import { componentsList } from "./components-list";
import { MonitorMenuItemsService } from "./monitor-menu-items.service";
import { RaWebAgentService, LayoutService, MenuItem } from "@ra/web-components";
import { Subscription } from "rxjs/internal/Subscription";
import { SubscriptionManager, SubscriptionManagerCollection } from "@ra/web-core-fe";

@Component({
    selector: "ra-bundle-layout",
    templateUrl: "./ra-layout.component.html",
    styleUrls: ["./ra-layout.component.less"]
})
export class RaLayoutComponent implements OnInit, OnDestroy {

    private subscriptions: SubscriptionManagerCollection;

    constructor(
        private monitorMenuItemsService: MonitorMenuItemsService,
        private raWebAgentService: RaWebAgentService,
        private layoutService: LayoutService,
        private subscriptionManager: SubscriptionManager,
    ) { }

    private initMenuItemsAction() {
        this.subscriptions.add = this.layoutService.itemAction$.subscribe((item: MenuItem) => {
            this.monitorMenuItemsService.itemActions(item);
        });
    }

    public ngOnInit(): void {
        this.subscriptions = this.subscriptionManager.createCollection(this);
        this.raWebAgentService.subscribeToItemActions();
        this.monitorMenuItemsService.setComponentList(componentsList);
        this.initMenuItemsAction();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
