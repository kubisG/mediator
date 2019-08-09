import { Component, OnInit} from "@angular/core";
import { AppMenuItemsService } from "../../oms-core/app-menu-items.service";
import { diagnosticComponentList } from "../diagnostic-list";

@Component({
    selector: "ra-diag-layout",
    templateUrl: "./layout.component.html",
    styleUrls: ["./layout.component.less"],
})
export class LayoutComponent  implements OnInit {

    constructor(
        public layoutMenuItemsService: AppMenuItemsService,
    ) {

    }

    ngOnInit(): void {
        this.layoutMenuItemsService.setAppMenuList(diagnosticComponentList, "Diagnostic");
        this.layoutMenuItemsService.setAppButtonsList();
    }
}
