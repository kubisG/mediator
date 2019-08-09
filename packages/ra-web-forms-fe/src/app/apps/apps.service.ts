import { Injectable } from "@angular/core";
import { FDC3Service, LayoutService, MenuItem, Context, FDC3Config } from "@ra/web-components";
import { HubFormsAuthService } from "../hub-forms-auth/hub-forms-auth.service";

@Injectable()
export class AppsService {

    constructor(
        private hubFormsAuthService: HubFormsAuthService,
        private fDC3Service: FDC3Service,
    ) { }

    public initFDC3Services(fdc3Components: FDC3Config) {
        this.fDC3Service.injections = [this.hubFormsAuthService];
    }

}
