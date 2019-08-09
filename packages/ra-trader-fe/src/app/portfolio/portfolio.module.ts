import { NgModule, SkipSelf, Optional } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { PortfolioComponent } from "./portfolio/portfolio.component";
import { PortfolioTableComponent } from "./portfolio-table/portfolio-table.component";
import { PortfolioDetailComponent } from "./portfolio-detail/portfolio-detail.component";
import { SharedModule } from "@ra/web-shared-fe";
import { DxDataGridModule } from "devextreme-angular/ui/data-grid";
import { DxLoadPanelModule } from "devextreme-angular/ui/load-panel";
import { MaterialModule } from "@ra/web-material-fe";
import { SymbolDetailComponent } from "./symbol-detail/symbol-detail.component";
import { DialogAccComponent } from "./dialog-acc/dialog-acc.component";
import { PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { OrdersModule } from "../orders/orders.module";
import { DataGridModule } from "@ra/web-components";
import { SymbolPriceComponent } from "./symbol-price/symbol-price.component";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        DxLoadPanelModule,
        DxDataGridModule,
        OrdersModule,
        DataGridModule,
        TranslateModule,
        PerfectScrollbarModule,
        MaterialModule,
    ],
    declarations: [
        DialogAccComponent,
        PortfolioTableComponent,
        PortfolioDetailComponent,
        SymbolPriceComponent,
        SymbolDetailComponent,
        PortfolioComponent,
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
    ],
    entryComponents: [
        DialogAccComponent,
        PortfolioTableComponent,
        PortfolioDetailComponent,
        SymbolDetailComponent
    ]
})
export class PortfolioModule {
    constructor(@Optional() @SkipSelf() parentModule: PortfolioModule) {
        if (parentModule) {
            throw new Error(
                "PortfolioModule is already loaded. Import it in the AppModule only");
        }
    }
}
