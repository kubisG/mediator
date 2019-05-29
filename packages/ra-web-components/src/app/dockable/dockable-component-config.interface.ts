import { Type } from "@angular/core";

export interface DockableComponentConfig {

    single?: boolean;
    closeable?: boolean;
    label: string;
    componentName: string;
    component: Type<any>;

}
