import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { MenuItem, LayoutMenuItemsService, LayoutService } from "@ra/web-components";
import { componentsList } from "./forms-components-list";
import { Subscription } from "rxjs/internal/Subscription";

@Component({
    selector: "ra-hub-forms",
    templateUrl: "./layout.component.html",
    styleUrls: ["./layout.component.less"],
})
export class LayoutComponent implements OnInit, OnDestroy {

    private menuItems: MenuItem[] = [
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

    clickSub: Subscription;

    constructor(
        private layoutMenuItemsService: LayoutMenuItemsService,
    ) { }

    public ngOnInit(): void {
        this.layoutMenuItemsService.setComponentList(componentsList, this.menuItems, "Forms");
    }

    public ngOnDestroy(): void {

    }
}
