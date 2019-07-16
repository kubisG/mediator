import {
    Component,
    ComponentFactoryResolver,
    Type,
    Inject,
    ViewChild,
    OnInit,
    OnDestroy,
    HostListener,
    InjectionToken
} from "@angular/core";
import { AdDirective } from "@ra/web-shared-fe";
import { Subscription } from "rxjs/internal/Subscription";
import { ActivatedRoute } from "@angular/router";
import { FDC3Service } from "./fdc3.service";
import { FDC3Config } from "./fdc3-config.interface";

export const FDC3_COMPONENTS = new InjectionToken<{ [key: string]: Type<any> }>("fdc3Components");

@Component({
    selector: "ra-fdc3",
    templateUrl: "./fdc3.component.html",
    styleUrls: ["./fdc3.component.less"],
})
export class FDC3Component implements OnInit, OnDestroy {

    @ViewChild(AdDirective) raAdHost: AdDirective;
    private sub: Subscription;
    componentRef: any;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        @Inject(FDC3_COMPONENTS) private fdc3Components: FDC3Config,
        private route: ActivatedRoute,
        private fDC3Service: FDC3Service,
    ) { }

    private getComponents(appId: string): Type<any> {
        const config = { ...this.fdc3Components[appId] };
        let component = this.fdc3Components[appId];
        if (config["main"]) {
            component = config["main"];
            delete config["main"];
        }
        return component as Type<any>
    }


    public loadComponent(appId: string) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.getComponents(appId));
        const viewContainerRef = this.raAdHost.viewContainerRef;
        viewContainerRef.clear();
        this.componentRef = viewContainerRef.createComponent(componentFactory);
    }

    public ngOnInit() {
        this.sub = this.route.params.subscribe((params) => {
            this.loadComponent(params["appId"]);
        });
    }

    @HostListener("window:message", ["$event"])
    public onMessage(message: MessageEvent) {
        console.log("message", message);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
