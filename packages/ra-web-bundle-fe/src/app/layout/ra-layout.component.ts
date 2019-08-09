import { Component, OnInit, OnDestroy } from "@angular/core";
import { LayoutMenuItemsService } from "@ra/web-components";
import { componentsList } from "../components-list";

@Component({
    selector: "ra-bundle-layout",
    templateUrl: "./ra-layout.component.html",
    styleUrls: ["./ra-layout.component.less"]
})
export class RaLayoutComponent implements OnInit, OnDestroy {

    constructor(
        private layoutMenuItemsService: LayoutMenuItemsService,
    ) { }

    public ngOnInit(): void {
        this.layoutMenuItemsService.setComponentList(componentsList);
    }

    public ngOnDestroy(): void {

    }
}
