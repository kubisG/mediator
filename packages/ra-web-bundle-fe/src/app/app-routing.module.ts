import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

export const routes: Routes = [
    { path: "", redirectTo: "/auth/login", pathMatch: "full" },
    { path: "auth", loadChildren: "./monitor-auth/monitor-auth-lazy.module#MonitorAuthLazyModule" },
    { path: "layout", loadChildren: "./layout/layout.module#LayoutModule" },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
