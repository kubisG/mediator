import { Component, OnInit, ComponentFactoryResolver, Injector, ApplicationRef } from "@angular/core";
import { HubService } from "../../core/hub.service";
import { Dockable, DockableComponent } from "@ra/web-components";

@Dockable({
    label: "Hub connections",
    icon: "settings_input_component",
    single: false
})
@Component({
    selector: "ra-diag-hub",
    templateUrl: "./diag-hub.component.html",
    styleUrls: ["./diag-hub.component.less"]
})
export class DiagHubComponent extends DockableComponent implements OnInit {

    public hubStatuses: { name: string, status: boolean }[] = [];

    constructor(
        private hubService: HubService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef) {
        super(componentFactoryResolver, injector, applicationRef);
    }

    public getNewStatus() {
        this.getHubStatus();
    }

    public getHubStatus() {
        const hubStatuses = this.hubService.getActStatus();
        const keys = Object.keys(hubStatuses);
        for (const key in keys) {
            if (hubStatuses[keys[key]]) {
                this.hubStatuses.push({ name: keys[key].slice(6), status: hubStatuses[keys[key]] === "UP" });
            }
        }
    }

    public ngOnInit(): void {
        this.getNewStatus();
    }

}
