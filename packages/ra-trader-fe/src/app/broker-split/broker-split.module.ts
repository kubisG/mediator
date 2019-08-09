import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { OrderSplitComponent } from "./order-store/order-store.component";
import { SplitStoreService } from "./split-store.service";
import { SharedModule } from "@ra/web-shared-fe";
import { InputRulesModule } from "../input-rules/input-rules.module";
import { DxDataGridModule } from "devextreme-angular/ui/data-grid";
import { DataDxGridModule } from "../data-grid/data-grid.module";
import { MaterialModule } from "@ra/web-material-fe";
import { OrdersModule } from "../orders/orders.module";
import { DataExchangeModule } from "@ra/web-components";

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
        MaterialModule,
        InputRulesModule,
        OrdersModule,
        PerfectScrollbarModule,
        DataExchangeModule,
    ],
    declarations: [
        OrderSplitComponent,
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        SplitStoreService,
    ],
    entryComponents: [
        OrderSplitComponent,
    ],
    exports: [
        OrderSplitComponent,
    ]
})
export class BrokerSplitModule {
    constructor(@Optional() @SkipSelf() parentModule: BrokerSplitModule) {
        if (parentModule) {
            throw new Error(
                "BrokerSplitModule is already loaded. Import it in the AppModule only");
        }
    }
}
