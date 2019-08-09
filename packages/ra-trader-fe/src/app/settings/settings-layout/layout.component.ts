import { Component, OnInit} from "@angular/core";

import { settingsComponentList } from "../settings-component-list";
import { AppMenuItemsService } from "../../oms-core/app-menu-items.service";

@Component({
    selector: "ra-settings-layout",
    templateUrl: "./layout.component.html",
    styleUrls: ["./layout.component.less"],
})
export class LayoutComponent implements OnInit {

    constructor(
        public layoutMenuItemsService: AppMenuItemsService,
    ) {

    }

    ngOnInit(): void {
        this.layoutMenuItemsService.setAppMenuList(settingsComponentList, "Settings");
        this.layoutMenuItemsService.setAppButtonsList();
    }

}
