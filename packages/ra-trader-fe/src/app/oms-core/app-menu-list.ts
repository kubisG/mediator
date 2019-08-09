import { Modules } from "../../module/module.enum";

export const appHeaderMenuItems = [
    {
        label: "Broker",
        icon: "money",
        route: "/broker",
        modules: [Modules.BROKER]
    },
    {
        label: "Trader",
        icon: "money",
        route: "/trader",
        modules: [Modules.TRADER]
    },
    {
        label: "Settings",
        icon: "settings",
        route: "/settings",
        modules: [Modules.BROKER, Modules.TRADER]
    },
    {
        label: "Diagnostic",
        icon: "memory",
        route: "/diagnostics",
        modules: [Modules.BROKER, Modules.TRADER]
    },
    {
        label: "Admin",
        icon: "person",
        route: "/admin",
        roles: ["ADMIN"],
        modules: [Modules.BROKER, Modules.TRADER]
    }
];
