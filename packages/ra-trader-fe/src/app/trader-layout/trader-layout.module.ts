import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HeaderModule, DockableModule, LayoutModule, LayoutMenuItemsService } from "@ra/web-components";
import { DxDataGridModule } from "devextreme-angular";
import { MaterialModule } from "@ra/web-material-fe";
import {
    GoldenLayoutModule,
    GoldenLayoutConfiguration,
    GoldenLayoutStateStore,
} from "@embedded-enterprises/ng6-golden-layout";
import { OrdersModule } from "../orders/orders.module";
import { TraderModule } from "../trader/trader.module";
import { PortfolioModule } from "../portfolio/portfolio.module";
import { traderComponentList } from "./trader-component-list";
import { TraderLayoutComponent } from "./trader-layout.component";
import { traderLayoutRoutes } from "./trader-layout.routing";
import { OmsCoreModule } from "../oms-core/oms-core.module";
import { STORE_MODULE, RestLayoutStateService } from "../oms-core/rest-layout-state.service";

const config: GoldenLayoutConfiguration = {
    components: [
        ...traderComponentList,
    ],
    defaultLayout: {
        settings: {
            hasHeaders: true,
            constrainDragToContainer: true,
            reorderEnabled: true,
            selectionEnabled: false,
            popoutWholeStack: true,
            blockedPopoutsThrowError: true,
            closePopoutsOnUnload: true,
            showPopoutIcon: true,
            showMaximiseIcon: true,
            showCloseIcon: true
        },
        content: [{
            type: "stack",
            isClosable: false,
            content: []
        }]
    }
};


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HeaderModule,
        DockableModule,
        MaterialModule,
        OmsCoreModule,
        RouterModule.forChild(traderLayoutRoutes),
        DxDataGridModule,
        OrdersModule,
        TraderModule,
        PortfolioModule,
        GoldenLayoutModule.forRoot(config),
        LayoutModule,
    ],
    declarations: [
        TraderLayoutComponent,
    ],
    exports: [],
    entryComponents: [],
    providers: [
        {
            provide: STORE_MODULE,
            useValue: "trader",
        },
        {
            provide: GoldenLayoutStateStore,
            useClass: RestLayoutStateService,
        },
    ]
})
export class TraderLayoutModule { }

