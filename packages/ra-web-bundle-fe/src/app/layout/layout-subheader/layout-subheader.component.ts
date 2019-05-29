import { Component } from "@angular/core";
import { DockableService } from "@ra/web-components";
import { MonitorGridComponent } from "@ra/web-monitor-fe";
import { componentsList } from "../../components-list";

@Component({
    selector: "ra-layout-subheader",
    templateUrl: "./layout-subheader.component.html",
    styleUrls: ["./layout-subheader.component.less"]
})
export class LayoutSubHeaderComponent {

    public components = componentsList;

    constructor(
        private dockableService: DockableService,
    ) { }

    public addComponent(component: any) {
        this.dockableService.addComponent({
            label: component.componentName,
            componentName: component.componentName,
            component: component.component,
        });
    }

}
