import { Type } from "@angular/core";

export interface FDC3Config {

    [name: string]: Type<any> | FDC3Config;

}
