import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppCustomPreloader } from "./app-custom-preloader";
import { traderModule } from "./app-trader-routing";
import { brokerModule } from "./app-broker-routing";
import { sharedRoutes } from "./app-shared-routing";

export const routes: Routes = [
    ...sharedRoutes,
    ...traderModule,
    ...brokerModule,
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        preloadingStrategy: AppCustomPreloader,
    })],
    providers: [
        AppCustomPreloader,
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
