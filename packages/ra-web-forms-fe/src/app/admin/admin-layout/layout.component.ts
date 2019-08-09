import { Component, OnInit, OnDestroy} from "@angular/core";
import { MenuItem, LayoutMenuItemsService } from "@ra/web-components";
import { Subscription } from "rxjs/internal/Subscription";
import { componentsList } from "../admin-components-list";


@Component({
    selector: "ra-admin-layout",
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
        this.layoutMenuItemsService.setComponentList(componentsList, this.menuItems, "Admin");
    }

    public ngOnDestroy(): void {

    }
}
