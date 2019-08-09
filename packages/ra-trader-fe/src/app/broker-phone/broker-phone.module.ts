import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { OrderPhoneComponent } from "./order-store/order-store.component";
import { PhoneStoreService } from "./phone-store.service";
import { SharedModule } from "@ra/web-shared-fe";
import { InputRulesModule } from "../input-rules/input-rules.module";
import { DxDataGridModule } from "devextreme-angular/ui/data-grid";
import { DataDxGridModule } from "../data-grid/data-grid.module";
import { MaterialModule } from "@ra/web-material-fe";
import { OrdersModule } from "../orders/orders.module";
import { DataExchangeModule } from "@ra/web-components";
import { OrderImportComponent } from "./order-import/order-import.component";

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
        OrderPhoneComponent,
        OrderImportComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        PhoneStoreService,
    ],
    entryComponents: [
        OrderPhoneComponent,
        OrderImportComponent
    ],
    exports: [
        OrderPhoneComponent,
    ]
})
export class BrokerPhoneModule {
    constructor(@Optional() @SkipSelf() parentModule: BrokerPhoneModule) {
        if (parentModule) {
            throw new Error(
                "BrokerPhoneModule is already loaded. Import it in the AppModule only");
        }
    }
}
