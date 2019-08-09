import { Routes } from "@angular/router";
import { AuthGuard } from "./core/authentication/auth.guard";
import { ModuleGuard } from "./core/guards/module.guard";
import { Modules } from "../module/module.enum";

export const brokerModule: Routes = [
    {
        path: "broker",
        loadChildren: "./broker-layout/broker-layout.module#BrokerLayoutModule",
        canActivate: [ModuleGuard, AuthGuard], data: {
            roles: ["ADMIN", "USER", "MANAGER", "READER"],
            preload: true,
            module: Modules.BROKER,
            headerMenu: { icon: "money", label: "Broker" }
        }
    }
];
