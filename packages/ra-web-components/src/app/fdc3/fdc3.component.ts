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
import { ActivatedRoute, Router } from "@angular/router";
import { FDC3Service } from "./fdc3.service";
import { FDC3Config } from "./fdc3-config.interface";
import { FDC3ComponentService } from "./fdc3-component-service";
import { LayoutService } from "../layout/layout.service";
import { Store } from "@ngxs/store";

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
        protected router: Router,
        private layoutService: LayoutService,
        private store: Store,
    ) { }

    private initComponent(appId: string, fdcComponentService: FDC3ComponentService, customData: any) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.fdc3Components[appId].component);
        const viewContainerRef = this.raAdHost.viewContainerRef;
        viewContainerRef.clear();
        this.componentRef = viewContainerRef.createComponent(componentFactory);
        if (this.componentRef.instance.setComponentState) {
            this.componentRef.instance.setComponentState(customData);
        }
        if (this.componentRef.instance.setFDC3ComponentService) {
            this.componentRef.instance.setFDC3ComponentService(fdcComponentService);
        }
    }


    public loadComponent(appId: string, data: any, token: any) {
        const fdcComponentService: FDC3ComponentService = this.fdc3Components[appId];
        fdcComponentService.fDC3Service = this.fDC3Service;
        fdcComponentService.layoutService = this.layoutService;
        fdcComponentService.router = this.router;
        fdcComponentService.data = data;
        fdcComponentService.token = token;
        fdcComponentService.store = this.store;
        fdcComponentService.start().then(() => {
            this.initComponent(appId, fdcComponentService, data);
        });
    }

    public ngOnInit() {
        this.sub = this.route.params.subscribe((params) => {
            const data = this.route.snapshot.queryParams["data"] ? JSON.parse(decodeURIComponent(this.route.snapshot.queryParams["data"])) : {};
            const token = this.route.snapshot.queryParams["token"] ? decodeURIComponent(this.route.snapshot.queryParams["token"]) : "";
            this.loadComponent(params["appId"], data, token);
        });
    }

    @HostListener("window:message", ["$event"])
    public onMessage(message: MessageEvent) {
        console.log("message", message);
    }

    @HostListener('window:beforeunload', ['$event'])
    public onClose(event) {

    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
