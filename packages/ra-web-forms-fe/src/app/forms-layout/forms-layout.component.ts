import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { MenuItem } from "@ra/web-components";
import { Subscription } from "rxjs/internal/Subscription";
import { FormsMenuItemsService } from "./forms-menu-items.service";

@Component({
    selector: "ra-hub-forms",
    templateUrl: "./forms-layout.component.html",
    styleUrls: ["./forms-layout.component.less"],
})
export class FormsLayoutComponent implements OnInit, OnDestroy {

    clickSub: Subscription;

    constructor(
        private layoutMenuItemsService: FormsMenuItemsService,
    ) { }

    public ngOnInit(): void {
        this.layoutMenuItemsService.init("Forms");
    }

    public ngOnDestroy(): void {

    }
}
