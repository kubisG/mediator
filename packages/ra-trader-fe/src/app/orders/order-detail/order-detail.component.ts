import {
    Component, OnInit,
    ComponentFactoryResolver, Injector, ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef
} from "@angular/core";
import { DockableComponent, Dockable } from "@ra/web-components";
import { DataExchangeService } from "@ra/web-components";

@Dockable({
    label: "Properties",
    icon: "tune",
    single: false
})
@Component({
    selector: "ra-order-detail",
    templateUrl: "./order-detail.component.html",
    styleUrls: ["./order-detail.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailComponent extends DockableComponent implements OnInit {
    public data;
    public lists;

    constructor(
        public hubDataExchangeService: DataExchangeService,
        protected changeDetectorRef: ChangeDetectorRef,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
    }

    ngOnInit() {
        const actData = this.hubDataExchangeService.getActData("DETAIL");
        if (actData.key && (actData.data) && (actData.data !== null)) {
            this.data = actData.data.order;
            this.lists = actData.data.lists;
        }

        this.dataSub = this.hubDataExchangeService.getData().subscribe((data) => {
            if ((data.key.indexOf("DETAIL") > -1) && (this.isBind) && (data.data) && (data.data !== null)
                && (data.data !== data.data.order)) {
                this.data = data.data.order;
                this.lists = data.data.lists;
                this.changeDetectorRef.markForCheck();
            }
        });

        this.clickSub = this.getHeaderResult().subscribe((data) => {
            this.isBind = data.isActive;
        });
    }

}
