import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

import { NgModule, SkipSelf, Optional } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "@ra/web-shared-fe";
import { MaterialModule } from "@ra/web-material-fe";
import { OrderStoreComponent } from "./order-store/order-store.component";
import { OrdersModule } from "../orders/orders.module";
import { RestBrokerService } from "../rest/rest-broker.service";
import { BrokerStoreService } from "./order-store/broker-store.service";
import { TranslateModule } from "@ngx-translate/core";
import { IoiBrokerTableComponent } from "./ioi-table/ioi-table.component";
import { BrokerIoiService } from "./ioi-table/broker-ioi.service";
import { IoiBrokerDialogComponent } from "./ioi-dialog/ioi-dialog.component";
import { DxDataGridModule } from "devextreme-angular/ui/data-grid";
import { InputRulesModule } from "../input-rules/input-rules.module";
import { RejectDialogComponent } from "./reject-dialog/reject-dialog.component";
import { AllocationsComponent } from "./allocations/allocations.component";
import { AllocationGridComponent } from "./allocation-grid/allocation-grid.component";
import { AllocationDialogComponent } from "./allocation-dialog/allocation-dialog.component";
import { FillReportComponent } from "./fill-report/fill-report.component";
import { CommissionDetailsComponent } from "./commission-details/commission-details.component";
import { BrokerAllocationsService } from "./allocations/borker-allocations.service";
import { MultiFillDialogComponent } from "./multi-fill-dialog/multi-fill-dialog.component";
import { SleuthGridDialogComponent } from "./sleuth-grid-dialog/sleuth-grid-dialog.component";
import { OrderActionsDialogComponent } from "./order-actions-dialog/order-actions-dialog.component";
import { FillService } from "./fill.service";
import { DataExchangeModule, DataGridModule } from "@ra/web-components";
import { NgxMaskModule } from "ngx-mask";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PerfectScrollbarModule,
        FormsModule,
        SharedModule,
        InputRulesModule,
        MaterialModule,
        DataGridModule,
        DxDataGridModule,
        OrdersModule,
        TranslateModule,
        DataExchangeModule,
        NgxMaskModule,
    ],
    declarations: [
        OrderStoreComponent,
        AllocationsComponent,
        AllocationGridComponent,
        AllocationDialogComponent,
        IoiBrokerTableComponent,
        IoiBrokerDialogComponent,
        RejectDialogComponent,
        FillReportComponent,
        CommissionDetailsComponent,
        MultiFillDialogComponent,
        SleuthGridDialogComponent,
        OrderActionsDialogComponent,
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        BrokerStoreService,
        BrokerAllocationsService,
        RestBrokerService,
        BrokerIoiService,
        FillService,
    ],
    entryComponents: [
        IoiBrokerDialogComponent,
        RejectDialogComponent,
        AllocationDialogComponent,
        MultiFillDialogComponent,
        SleuthGridDialogComponent,
        OrderActionsDialogComponent,
        OrderStoreComponent,
        IoiBrokerTableComponent,
        AllocationsComponent,
    ]
})
export class BrokerModule {
    constructor(@Optional() @SkipSelf() parentModule: BrokerModule) {
        if (parentModule) {
            throw new Error(
                "BrokerModule is already loaded. Import it in the AppModule only");
        }
    }
}
