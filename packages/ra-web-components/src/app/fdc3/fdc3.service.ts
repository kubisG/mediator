import { Injectable, Type } from "@angular/core";
import { Store } from "@ngxs/store";
import { FDC3ProvidersFactoryService } from "./providers/fdc3-providers-factory.service";

@Injectable()
export class FDC3Service {

    constructor(
        private store: Store,
        private fDC3ProvidersFactoryService: FDC3ProvidersFactoryService,
    ) { }

    open(appId: string) {
        const token = this.store.snapshot().auth.accessToken;
        this.fDC3ProvidersFactoryService.open({
            name: `${appId}`,
            url: `/fdc3/${appId}`,
            customRequestHeaders: [
                {
                    headers: [
                        { Authorization: token }
                    ]
                }
            ]
        });
    }

}
