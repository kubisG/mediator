import { Component, OnInit } from "@angular/core";

import { traderComponentList } from "./trader-component-list";
import { AppMenuItemsService } from "../oms-core/app-menu-items.service";

// extends HeaderLayoutComponent

@Component({
    selector: "ra-trader-layout",
    templateUrl: "./trader-layout.component.html",
    styleUrls: ["./trader-layout.component.less"],
})
export class TraderLayoutComponent implements OnInit {

    constructor(
        public layoutMenuItemsService: AppMenuItemsService,
    ) {

    }

    ngOnInit(): void {
        this.layoutMenuItemsService.setAppMenuList(traderComponentList, "Trader");
        this.layoutMenuItemsService.setAppButtonsList();
    }
}
