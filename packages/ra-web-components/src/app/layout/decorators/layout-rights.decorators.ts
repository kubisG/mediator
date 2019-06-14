import { Reflect } from "core-js";
import { LayoutRightsConfig } from "./layout-rights-config.interface";

export const LAYOUTRIGHTS_CONFIG = "__layoutRightsConfig";

export function LayoutRights(config: LayoutRightsConfig) {
    return (target: any) => {
        Reflect.defineMetadata(LAYOUTRIGHTS_CONFIG, config, target);
    };
}
