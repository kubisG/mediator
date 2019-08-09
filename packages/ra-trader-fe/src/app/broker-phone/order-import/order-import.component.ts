import {
    Component, ComponentFactoryResolver, Injector, ApplicationRef
} from "@angular/core";
import { DockableComponent, Dockable, DockableHooks } from "@ra/web-components";
import { PhoneStoreService } from "../phone-store.service";
import { MessageFactoryService } from "../../orders/message-factory.service";


@Dockable({
    label: "Import Order",
    icon: "cloud_upload",
    single: false
})
@Component({
    selector: "ra-phone-import",
    templateUrl: "./order-import.component.html",
    styleUrls: ["./order-import.component.less"],
})
export class OrderImportComponent extends DockableComponent implements DockableHooks {

    public repaintGrid = false;

    constructor(
        public orderStoreService: PhoneStoreService,
        public messageFactoryService: MessageFactoryService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
    }

    public sendMsg(result) {
        const message = this.messageFactoryService.newOrder(result);
        this.orderStoreService.sendMessage(message);
    }

    dockableClose(): Promise<void> {
        return Promise.resolve();
    }
    dockableShow() {
        this.repaintGrid = true;
    }
    dockableTab() {
    }
    dockableHide() {
        this.repaintGrid = false;
    }
}
