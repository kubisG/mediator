import { Reflect } from "core-js";
import { DockableConfig } from "./dockable-config.interface";

export const DOCKABLE_CONFIG = "__dockableConfig";

export function Dockable(config: DockableConfig) {
    return (target: any) => {
        Reflect.defineMetadata(DOCKABLE_CONFIG, config, target);
    };
}
