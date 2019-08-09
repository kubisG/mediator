import { OrderStoreComponent } from "../broker/order-store/order-store.component";
import { OrderDetailDialogComponent } from "../orders/order-detail-dialog/order-detail-dialog.component";
import { OrderPhoneComponent } from "../broker-phone/order-store/order-store.component";
import { OrderSplitComponent } from "../broker-split/order-store/order-store.component";
import { OrderDetailComponent } from "../orders/order-detail/order-detail.component";
import { SleuthGridDialogComponent } from "../broker/sleuth-grid-dialog/sleuth-grid-dialog.component";
import { OrderTreeComponent } from "../orders/order-tree/order-tree.component";
import { IoiBrokerTableComponent } from "../broker/ioi-table/ioi-table.component";
import { OrderImportComponent } from "../broker-phone/order-import/order-import.component";
import { AllocationsComponent } from "../broker/allocations/allocations.component";
import { NotifyComponent } from "@ra/web-components";

export const brokerComponentList = [{
    component: OrderStoreComponent,
    componentName: "ra-order-store"
},
{
    component: NotifyComponent,
    componentName: "ra-broker-notify"
},
{
    component: OrderDetailDialogComponent,
    componentName: "ra-broker-order-detail-dialog"
},
{
    component: OrderPhoneComponent,
    componentName: "ra-phone-store"
},
{
    component: OrderSplitComponent,
    componentName: "ra-split-store"
},
{
    component: OrderDetailComponent,
    componentName: "ra-broker-order-detail"
},
{
    component: SleuthGridDialogComponent,
    componentName: "ra-broker-sleuth-grid-dialog"
},
{
    component: OrderTreeComponent,
    componentName: "ra-broker-order-tree"
},
{
    component: IoiBrokerTableComponent,
    componentName: "ra-broker-ioi-table"
},
{
    componentName: "ra-broker-order-import",
    component: OrderImportComponent
},
{
    componentName: "ra-broker-allocations",
    component: AllocationsComponent
}];
