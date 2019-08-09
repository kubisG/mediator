import { Routes } from "@angular/router";
import { AuthGuard } from "./core/authentication/auth.guard";
import { ModuleGuard } from "./core/guards/module.guard";
import { Modules } from "../module/module.enum";

export const traderModule: Routes = [
    {
        path: "trader",
        loadChildren: "./trader-layout/trader-layout.module#TraderLayoutModule",
        canActivate: [ModuleGuard, AuthGuard], data: {
            roles: ["ADMIN", "USER", "MANAGER", "READER"],
            preload: true,
            module: Modules.TRADER,
            headerMenu: { icon: "home", label: "Blotter" }
        }
    }
];
