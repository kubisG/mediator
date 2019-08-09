import { Component, OnInit, Inject, ComponentFactoryResolver, Injector, ApplicationRef, OnDestroy } from "@angular/core";
import { DockableComponent, Dockable } from "@ra/web-components";
import { DataExchangeService } from "@ra/web-components";
import { Subscription } from "rxjs/internal/Subscription";
import { HubFormsHeaderComponent } from "../hub-forms-header/hub-forms-header.component";

@Dockable({
    header: { component: HubFormsHeaderComponent },
    label: "Tree",
    icon: "timeline"
})
@Component({
    selector: "ra-hub-forms-tree",
    templateUrl: "./hub-forms-tree.component.html",
    styleUrls: ["./hub-forms-tree.component.less"],
})
export class HubFormsTreeComponent extends DockableComponent implements OnInit, OnDestroy {

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

        this.hubDataExchangeService.getData().subscribe((data) => {
            if ((data.key === "ORDER") && (this.isBind) && (data.data) && (data.data !== null)) {
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
