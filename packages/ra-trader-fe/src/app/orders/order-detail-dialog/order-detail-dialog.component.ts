import {
    Component, ChangeDetectorRef,
    OnInit, ComponentFactoryResolver, Injector, ApplicationRef, ChangeDetectionStrategy
} from "@angular/core";
import { DockableComponent, Dockable } from "@ra/web-components";
import { DataExchangeService } from "@ra/web-components";
import { MatDialogRef } from "@angular/material";

@Dockable({
    label: "Detail",
    icon: "edit",
    single: false
})
@Component({
    selector: "ra-broker-order-detail-dialog",
    templateUrl: "./order-detail-dialog.component.html",
    styleUrls: ["./order-detail-dialog.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailDialogComponent extends DockableComponent implements OnInit {

    public data;
    public lists;
    public replaceMessage;
    dialogRef: MatDialogRef<OrderDetailDialogComponent>;

    constructor(
        public hubDataExchangeService: DataExchangeService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
        protected changeDetectorRef: ChangeDetectorRef,
    ) {
        super(componentFactoryResolver, injector, applicationRef);
        try {
            this.dialogRef = (this.injector.get(MatDialogRef) as any);
        } catch (ex) {
        }
    }

    ngOnInit() {
        const actData = this.hubDataExchangeService.getActData("ORDER");
        if (actData.key && (actData.data) && (actData.data !== null) && (actData.data !== this.data)) {

            this.data = actData.data.order;
            if (this.data.replaceMessage) {
                this.replaceMessage = this.data.replaceMessage;
            }
            this.lists = actData.data.lists;
        }

        this.dataSub = this.hubDataExchangeService.getData().subscribe((data) => {
            if ((data.key.indexOf("ORDER") > -1) && (this.isBind) && (data.data) && (data.data !== null)
                && (data.data.order !== this.data)) {
                this.data = data.data.order;
                this.lists = data.data.lists;
                this.changeDetectorRef.markForCheck();
            }
        });

        this.clickSub = this.getHeaderResult().subscribe((data) => {
            this.isBind = data.isActive;
        });
    }

    public onNoClick() {
        this.dialogRef.close();
    }

}
