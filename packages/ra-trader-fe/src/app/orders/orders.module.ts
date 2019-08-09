import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "@ra/web-shared-fe";
import { MaterialModule } from "@ra/web-material-fe";
import { NgModule } from "@angular/core";
import { OrderGridComponent } from "./order-grid/order-grid.component";
import { OrderGridService } from "./order-grid/order-grid.service";
import { DxDataGridModule } from "devextreme-angular/ui/data-grid";
import { DataDxGridModule } from "../data-grid/data-grid.module";
import { OrderTreeViewComponent } from "./order-tree-view/order-tree-view.component";
import { OrderTreeComponent } from "./order-tree/order-tree.component";
import { OrderFillsComponent } from "./order-fills/order-fills.component";
import { DxLinearGaugeModule, DxLoadPanelModule } from "devextreme-angular";
import { TranslateModule } from "@ngx-translate/core";
import { RowActionsComponent } from "./row-actions/row-actions.component";
import { OrderStatusService } from "./order-status.service";
import { MessageFactoryService } from "./message-factory.service";
import { OrderDetailComponent } from "./order-detail/order-detail.component";
import { RowGraphComponent } from "./row-graph/row-graph.component";
import { RowSelectComponent } from "./row-select/row-select.component";
import { OrderDetailDialogComponent } from "./order-detail-dialog/order-detail-dialog.component";
import { TreeRowComponent } from "./tree-row/tree-row.component";
import { OrderDialogComponent } from "./order-dialog/order-dialog.component";
import { InputRulesModule } from "../input-rules/input-rules.module";
import { OrderImportComponent } from "./order-import/order-import.component";
import { OrderImportService } from "./order-import/order-import.service";
import { NgxMaskModule } from "ngx-mask";
import { CancelDialogComponent } from "./cancel-dialog/cancel-dialog.component";
import { DataGridModule } from "@ra/web-components";
import { RowIconsComponent } from "./row-icons/row-icons.component";

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
        MaterialModule,
        DataDxGridModule,
        DataGridModule,
        DxDataGridModule,
        DxLinearGaugeModule,
        DxLoadPanelModule,
        NgxMaskModule.forRoot(),
        TranslateModule,
        InputRulesModule,
    ],
    declarations: [
        OrderGridComponent,
        OrderTreeViewComponent,
        OrderTreeComponent,
        OrderFillsComponent,
        OrderDialogComponent,
        RowActionsComponent,
        RowIconsComponent,
        OrderDetailComponent,
        RowSelectComponent,
        RowGraphComponent,
        OrderDetailDialogComponent,
        CancelDialogComponent,
        TreeRowComponent,
        OrderImportComponent,
    ],
    entryComponents: [
        OrderDetailDialogComponent,
        CancelDialogComponent,
        OrderDialogComponent,
        OrderDetailComponent,
        OrderTreeComponent,
        OrderImportComponent,
        OrderFillsComponent,
        RowGraphComponent,
        RowIconsComponent,
    ],
    providers: [
        OrderGridService,
        OrderStatusService,
        MessageFactoryService,
        OrderImportService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
    ],
    exports: [
        OrderGridComponent,
        OrderTreeViewComponent,
        OrderTreeComponent,
        OrderFillsComponent,
        OrderDialogComponent,
        OrderDetailComponent,
        TreeRowComponent,
        OrderImportComponent,
    ]
})
export class OrdersModule {

}
