import { FDC3ComponentService } from "./fdc3-component-service";

export interface FDC3Config {

    [name: string]: new () => FDC3ComponentService;

}
