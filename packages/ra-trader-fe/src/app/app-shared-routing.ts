import { Routes } from "@angular/router";
import { AuthGuard } from "./core/authentication/auth.guard";

export const sharedRoutes: Routes = [
    { path: "", redirectTo: "/auth/login", pathMatch: "full" },
    {
        path: "settings",
        loadChildren: "./settings/settings.module#SettingsLayoutModule",
        canActivate: [AuthGuard], data: { roles: ["ADMIN", "USER", "MANAGER", "READER"] }
    },
    {
        path: "admin",
        loadChildren: "./admin/admin.module#AdminLayoutModule",
        canActivate: [AuthGuard], data: { roles: ["ADMIN"], preload: true }
    },
    {
        path: "auth",
        loadChildren: "./authentication/authentication.module#AuthenticationModule"
    },
    {
        path: "diagnostics",
        loadChildren: "./diagnostics/diagnostics.module#DiagnosticsModule"
    },
];
