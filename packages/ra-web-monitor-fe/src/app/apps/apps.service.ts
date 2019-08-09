import { Injectable } from "@angular/core";
import { FDC3Service, LayoutService, MenuItem, Context, FDC3Config } from "@ra/web-components";
import { MonitorAuthService } from "../monitor-auth/monitor-auth.service";
import { Router } from "@angular/router";

@Injectable()
export class AppsService {

    constructor(
        private monitorAuthService: MonitorAuthService,
        private fDC3Service: FDC3Service,
    ) { }

    public initFDC3Services(fdc3Components: FDC3Config) {
        this.fDC3Service.injections = [this.monitorAuthService];
    }

}
