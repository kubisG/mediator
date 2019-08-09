import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { OrderStoreComponent } from "./order-store/order-store.component";
import { TraderStoreService } from "./order-store/trader-store.service";
import { SharedModule } from "@ra/web-shared-fe";
import { InputRulesModule } from "../input-rules/input-rules.module";
import { DxDataGridModule } from "devextreme-angular/ui/data-grid";
import { DataDxGridModule } from "../data-grid/data-grid.module";
import { BalanceInfoComponent } from "./balance-info/balance-info.component";
import { AllocationsComponent } from "./allocations/allocations.component";
import { AllocationDialogComponent } from "./allocation-dialog/allocation-dialog.component";
import { AllocationGridComponent } from "./allocation-grid/allocation-grid.component";
import { TraderAllocationsService } from "./allocations/trader-allocations.service";
import { MaterialModule } from "@ra/web-material-fe";
import { IoiTableComponent } from "./ioi-table/ioi-table.component";
import { TraderIoiService } from "./ioi-table/trader-ioi.service";
import { IoiDialogComponent } from "./ioi-dialog/ioi-dialog.component";
import { OrdersModule } from "../orders/orders.module";
import { EikonModule } from "../eikon/eikon.module";
import { DataExchangeModule, DataGridModule } from "@ra/web-components";
import { OrderImportComponent } from "./order-import/order-import.component";
import { OrderFillsComponent } from "./order-fills/order-fills.component";


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};
/**
 * TODO : import only used modules
 */
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        TranslateModule,
        DxDataGridModule,
        DataDxGridModule,
        DataGridModule,
        MaterialModule,
        InputRulesModule,
        OrdersModule,
        PerfectScrollbarModule,
        EikonModule,
        DataExchangeModule,
    ],
    declarations: [
        OrderStoreComponent,
        IoiDialogComponent,
        BalanceInfoComponent,
        AllocationsComponent,
        AllocationDialogComponent,
        AllocationGridComponent,
        IoiTableComponent,
        OrderImportComponent,
        OrderFillsComponent,
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        TraderStoreService,
        TraderIoiService,
        TraderAllocationsService,
    ],
    entryComponents: [
        AllocationDialogComponent,
        IoiDialogComponent,
        OrderStoreComponent,
        AllocationsComponent,
        IoiTableComponent,
        OrderImportComponent,
        OrderFillsComponent
    ]
})
export class TraderModule {
    constructor(@Optional() @SkipSelf() parentModule: TraderModule) {
        if (parentModule) {
            throw new Error(
                "TraderModule is already loaded. Import it in the AppModule only");
        }
    }
}
