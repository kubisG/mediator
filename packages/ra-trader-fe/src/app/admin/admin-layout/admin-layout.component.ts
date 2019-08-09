
import { LayoutStateStorage } from "@ra/web-components";
import { GoldenLayoutStateStore } from "@embedded-enterprises/ng6-golden-layout";
import { Component, OnInit, Inject } from "@angular/core";
import { adminComponentList } from "./admin-component-list";
import { AppMenuItemsService } from "../../oms-core/app-menu-items.service";

@Component({
    selector: "ra-admin-layout",
    templateUrl: "./admin-layout.component.html",
    styleUrls: ["./admin-layout.component.less"],
})
export class AdminLayoutComponent implements OnInit {

    constructor(
        @Inject(GoldenLayoutStateStore) private stateStore: LayoutStateStorage,
        public layoutMenuItemsService: AppMenuItemsService,
    ) { }

    ngOnInit(): void {
        this.layoutMenuItemsService.setAppMenuList(adminComponentList, "Admin");
        this.layoutMenuItemsService.setAppButtonsList();
    }

}
