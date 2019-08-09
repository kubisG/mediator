import { OrderStoreComponent } from "../trader/order-store/order-store.component";
import { PortfolioDetailComponent } from "../portfolio/portfolio-detail/portfolio-detail.component";
import { PortfolioTableComponent } from "../portfolio/portfolio-table/portfolio-table.component";
import { OrderDetailComponent } from "../orders/order-detail/order-detail.component";
import { SymbolDetailComponent } from "../portfolio/symbol-detail/symbol-detail.component";
import { OrderTreeComponent } from "../orders/order-tree/order-tree.component";
import { IoiTableComponent } from "../trader/ioi-table/ioi-table.component";
import { OrderImportComponent } from "../trader/order-import/order-import.component";
import { AllocationsComponent } from "../trader/allocations/allocations.component";
import { OrderFillsComponent } from "../trader/order-fills/order-fills.component";

export const traderComponentList = [{
    component: OrderStoreComponent,
    componentName: "ra-blotter-store"
},
{
    component: PortfolioDetailComponent,
    componentName: "ra-portfolio-detail"
},
{
    component: PortfolioTableComponent,
    componentName: "ra-portfolio-table"
},
{
    component: OrderDetailComponent,
    componentName: "ra-trader-order-detail"
},
{
    component: SymbolDetailComponent,
    componentName: "ra-symbol-detail"
},
{
    component: OrderTreeComponent,
    componentName: "ra-trader-order-tree"
},
{
    component: IoiTableComponent,
    componentName: "ra-ioi-table"
},
{
    component: OrderImportComponent,
    componentName: "ra-trader-order-import"
},
{
    component: AllocationsComponent,
    componentName: "ra-allocations"
},
{
    component: OrderFillsComponent,
    componentName: "ra-order-fills"
}];
