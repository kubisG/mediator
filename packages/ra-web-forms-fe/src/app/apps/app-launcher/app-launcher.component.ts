import { Component, OnInit, OnDestroy } from "@angular/core";
import { componentsList } from "../../forms-layout/forms-components-list";
import { LauncherMenuItemsService } from "../launcher-menu-items.service";

@Component({
    selector: "ra-app-launcher",
    templateUrl: "./app-launcher.component.html",
    styleUrls: ["./app-launcher.component.less"]
})
export class AppLauncherComponent implements OnInit, OnDestroy {

    constructor(
        private launcherMenuItemsService: LauncherMenuItemsService,
    ) { }

    public ngOnInit(): void {
        this.launcherMenuItemsService.setComponentList(componentsList);
    }

    public ngOnDestroy(): void {

    }

}
