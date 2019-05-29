import { Component, OnInit, Inject } from "@angular/core";
import { LayoutMenuItemsService } from "./layout-menu-items.service";
import { MenuItem } from "@ra/web-components";
import { Observable } from "rxjs/internal/Observable";
import * as GoldenLayout from "golden-layout";
import { GoldenLayoutContainer } from "@embedded-enterprises/ng6-golden-layout";

@Component({
    selector: "ra-monitor",
    templateUrl: "./layout.component.html",
    styleUrls: ["./layout.component.less"]
})
export class LayoutComponent implements OnInit {

    public headerMenuItems: Observable<MenuItem[]>;

    constructor(
        private layoutMenuItemsService: LayoutMenuItemsService,
    ) { }

    public onMenuItemClick(item: MenuItem) {
        this.layoutMenuItemsService.doMenuItemAction(item);
    }

    public ngOnInit(): void {
        this.headerMenuItems = this.layoutMenuItemsService.headerMenuItems$;
    }

}
