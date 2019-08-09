import { Component, OnInit, Inject, ComponentFactoryResolver, Injector, ApplicationRef, OnDestroy } from "@angular/core";
import { DockableComponent, Dockable } from "@ra/web-components";
import { Subscription } from "rxjs/internal/Subscription";
import { HubFormsHeaderComponent } from "../hub-forms-header/hub-forms-header.component";
import { DataExchangeService } from "@ra/web-components";

@Dockable({
    header: { component: HubFormsHeaderComponent },
    label: "Detail",
    icon: "visibility"
})
@Component({
    selector: "ra-hub-forms-detail",
    templateUrl: "./hub-forms-detail.component.html",
    styleUrls: ["./hub-forms-detail.component.less"],
})
export class HubFormsDetailComponent extends DockableComponent implements OnInit, OnDestroy {

    private tabSub: Subscription;
    private hubSub: Subscription;
    public data;
    public lists;

    constructor(
        public hubDataExchangeService: DataExchangeService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
    }

    public unsubscribe() {
        if (this.tabSub) {
            this.tabSub.unsubscribe();
        }
        if (this.hubSub) {
            this.hubSub.unsubscribe();
        }
    }


    ngOnInit() {
        const actData = this.hubDataExchangeService.getActData("ORDER");
        if (actData.key && (actData.data) && (actData.data !== null)) {
            this.data = actData.data.order;
            this.lists = actData.data.lists;
        }

        this.hubSub = this.hubDataExchangeService.getData().subscribe((data) => {
            if ((data.key.indexOf("ORDER") > -1) && (this.isBind) && (data.data) && (data.data !== null)) {

                this.data = data.data.order;
                this.lists = data.data.lists;
            }
        });

        this.tabSub = this.getHeaderResult().subscribe((data) => {
            this.isBind = data.isActive;
        });
    }

    ngOnDestroy() {
        this.unsubscribe();
    }
}
