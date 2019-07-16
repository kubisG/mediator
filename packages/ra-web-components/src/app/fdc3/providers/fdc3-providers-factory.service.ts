import { Injectable } from "@angular/core";
import { FDC3Provider } from "./fdc3-provider.interface";
import { OpenFin } from "./openfin";

@Injectable()
export class FDC3ProvidersFactoryService implements FDC3Provider {

    private provider: FDC3Provider;

    constructor() {
        this.init();
    }

    private init() {
        if ((window as any).fin) {
            this.provider = new OpenFin();
        } else {
            this.provider = new OpenFin();
        }
    }

    hide() {
        return this.provider.hide();
    }

    open(options: any): Promise<any> {
        return this.provider.open(options);
    }

}
