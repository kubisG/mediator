import { Type } from '@angular/core';

export interface DockableConfig {
    tab: { component: Type<any> };
    header: { component: Type<any>, single: boolean };
}
