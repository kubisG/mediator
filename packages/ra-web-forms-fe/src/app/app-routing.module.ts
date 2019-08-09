import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

export const routes: Routes = [
    { path: "", redirectTo: "/auth/login", pathMatch: "full" },
    { path: "auth", loadChildren: "./hub-forms-auth/hub-forms-auth-lazy.module#HubFormsAuthLazyModule" },
    { path: "layout", loadChildren: "./forms-layout/forms-layout.module#FormsLayoutModule" },
    { path: "admin", loadChildren: "./admin/admin.module#AdminLayoutModule" },
    { path: "fdc3", loadChildren: "./apps/apps.module#AppsModule" },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
