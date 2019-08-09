import { Component, OnInit } from "@angular/core";
import { brokerComponentList } from "./broker-component-list";
import { AppMenuItemsService } from "../oms-core/app-menu-items.service";

// extends HeaderLayoutComponent

@Component({
    selector: "ra-broker-layout",
    templateUrl: "./broker-layout.component.html",
    styleUrls: ["./broker-layout.component.less"],
})
export class BrokerLayoutComponent implements OnInit {

    constructor(
        public layoutMenuItemsService: AppMenuItemsService,
    ) {
    }

    ngOnInit(): void {
        this.layoutMenuItemsService.setAppMenuList(brokerComponentList, "Broker");
        this.layoutMenuItemsService.setAppButtonsList();
    }

}
