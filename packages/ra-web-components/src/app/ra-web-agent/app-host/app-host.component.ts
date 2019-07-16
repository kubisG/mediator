import { Dockable } from "../../dockable/decorators/dockable.decorators";
import { DockableComponent } from "../../dockable/dockable.component";
import { DockableHooks } from "../../dockable/dockable-hooks.interface";
import { Component, OnInit, ComponentFactoryResolver, Injector, ApplicationRef, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { RaManifest } from "../manifest/ra-manifest";
import { DomSanitizer } from "@angular/platform-browser";
import { AppHostService } from "./app-host.service";
import { SafeResourceUrl } from "@angular/platform-browser";
@Dockable({
    label: "App Host",
    params: {}
})
@Component({
    selector: "ra-app-host",
    templateUrl: "./app-host.component.html",
    styleUrls: ["./app-host.component.less"],
    providers: [AppHostService]
})
export class AppHostComponent extends DockableComponent implements OnInit, AfterViewInit, DockableHooks {

    private raManifest: RaManifest;

    @ViewChild("iframe") private iframe: ElementRef;
    public appUrl: SafeResourceUrl;

    constructor(
        private appHostService: AppHostService,
        public sanitizer: DomSanitizer,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(
            componentFactoryResolver,
            injector,
            applicationRef,
        );
    }

    ngOnInit(): void {
        this.raManifest = this.componentState.manifest;
        this.appUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.raManifest.getUrl());
    }

    ngAfterViewInit(): void {
        this.appHostService.initFrameCommunication(this.iframe);
    }

    dockableClose(): Promise<void> {
        return Promise.resolve();
    }

    dockableShow() {

    }

    dockableTab() {

    }

    dockableHide() {

    }

}
