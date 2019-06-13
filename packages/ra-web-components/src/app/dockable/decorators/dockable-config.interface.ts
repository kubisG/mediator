import { Type } from "@angular/core";

export interface DockableConfig {
    tab?: { component: Type<any> };
    header?: { component: Type<any> };
    label?: string;
    icon?: string;
    single?: boolean;
    closeable?: boolean;
}
