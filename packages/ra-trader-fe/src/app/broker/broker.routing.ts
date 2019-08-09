import { Routes } from "@angular/router";
import { BrokerComponent } from "./broker.component";
import { OrderStoreComponent } from "./order-store/order-store.component";
import { AllocationsComponent } from "./allocations/allocations.component";

export const brokerRoutes: Routes = [
    { path: "", redirectTo: "order-store/RegularBooking", pathMatch: "full" },
    {
        path: "", component: BrokerComponent,
        children: [
            { path: "order-store/:id", component: OrderStoreComponent },
            { path: "allocations", component: AllocationsComponent },
        ],
    },
];
