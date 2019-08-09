import { Component, OnInit, ComponentFactoryResolver, Injector, ApplicationRef } from "@angular/core";
import { RestDiagnostics } from "../../rest/rest-diagnostincs";
import { Dockable, DockableComponent } from "@ra/web-components";

@Dockable({
    label: "Server",
    icon: "battery_unknown",
    single: false
})
@Component({
    selector: "ra-diag-server",
    templateUrl: "./diag-server.component.html",
    styleUrls: ["./diag-server.component.less"]
})
export class DiagServerComponent extends DockableComponent implements OnInit {

    public statuses: { name: string, status: boolean, host: string }[];

    constructor(
        private restDiagnostics: RestDiagnostics,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef) {
        super(componentFactoryResolver, injector, applicationRef);
    }

    public getNewStatus() {
        this.getSystemStatus();
    }


    public getSystemStatus() {
        this.restDiagnostics.getSystemStatus().then((data) => {
            this.statuses = data;
        });
    }

    public ngOnInit(): void {
        this.getNewStatus();
    }

}
