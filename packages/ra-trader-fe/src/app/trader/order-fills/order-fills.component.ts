import {
    Component, OnInit, ComponentFactoryResolver, Injector, ApplicationRef
} from "@angular/core";

import { Dockable, DockableComponent, DockableHooks } from "@ra/web-components";
import { TraderStoreService } from "../order-store/trader-store.service";
import { MessageType } from "@ra/web-shared-fe";
import { Subscription } from "rxjs/internal/Subscription";

@Dockable({
    label: "Order Fills",
    icon: "equalizer",
    single: false
})
@Component({
    selector: "ra-trader-fills",
    templateUrl: "./order-fills.component.html",
    styleUrls: ["./order-fills.component.less"],
})
export class OrderFillsComponent extends DockableComponent implements OnInit, DockableHooks {

    public execution;
    public initData;
    private executionSub: Subscription;

    constructor(
        public orderStoreService: TraderStoreService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
    }

    ngOnInit() {


        this.reloadData(true);

        this.executionSub = this.orderStoreService.getRoutingMessageType(MessageType.Execution).subscribe((execution) => {
             this.execution = execution;
        });
    }

    public reloadData(evt) {
        this.orderStoreService.getFills().then((messages) => {
            if (!messages) {
                return;
            }
            this.initData = messages;
        }).catch((err) => {
            console.log(err);
            this.initData = [];
        });
    }

    dockableClose(): Promise<void> {
        if (this.executionSub) {
            this.executionSub.unsubscribe();
        }
        return Promise.resolve();
    }

    dockableShow() {
    }

    dockableTab() {
    }
    dockableHide() {
    }

}

