import { Routes } from "@angular/router";
import { OrderStoreComponent } from "./order-store/order-store.component";
import { AllocationsComponent } from "./allocations/allocations.component";
import { OrderDetailComponent } from "../orders/order-detail/order-detail.component";

export const traderLayoutRoutes: Routes = [
    { path: "", redirectTo: "order-store", pathMatch: "full" },
    {
        // path: "", component: TraderLayoutComponent,
        children: [
            { path: "order-store", component: OrderStoreComponent },
            { path: "allocations", component: AllocationsComponent },
            { path: "detail/:id", component: OrderDetailComponent }
        ],
    },
];
