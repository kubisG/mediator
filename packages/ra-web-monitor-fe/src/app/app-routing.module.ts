import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

export const routes: Routes = [
    { path: "", redirectTo: "/auth/login", pathMatch: "full" },
    { path: "auth", loadChildren: "./monitor-auth/monitor-auth-lazy.module#MonitorAuthLazyModule" },
    { path: "layout", loadChildren: "./ra-layout/ra-layout.module#RaLayoutModule" },
    { path: "fdc3", loadChildren: "./apps/apps.module#AppsModule" },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
