import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MonitorModule } from "../monitor/monitor.module";
import { SharedModule } from "@ra/web-shared-fe";
import { GoldenLayoutConfiguration, GoldenLayoutModule, GoldenLayoutStateStore } from "@embedded-enterprises/ng6-golden-layout";
import {
    FDC3Module,
    STORE_MODULE,
    LayoutMenuItemsService,
    RestLayoutStateService,
    DockableModule,
    LayoutModule,
    RaWebAgentModule
} from "@ra/web-components";
import { MonitorAuthLazyModule } from "../monitor-auth/monitor-auth-lazy.module";
import { AppsService } from "./apps.service";
import { RaPlatformMonitorLauncher } from "./ra-platform-monitor-launcher";
import { RaPlatformMonitorLogin } from "./ra-platform-monitor-login";
import { RaPlatformMonitorGrid } from "./ra-platform-monitor-grid";
import { FDC3Config } from "@ra/web-components";
import { LauncherMenuItemsService } from "./launcher-menu-items.service";
import { environment } from "../../environments/environment";
import { AppLauncherComponent } from "./app-launcher/app-launcher.component";

const config: GoldenLayoutConfiguration = {
    components: [],
    defaultLayout: {
        content: [{
            type: "stack",
            isClosable: false,
            content: []
        }]
    }
};

const fdc3Components: FDC3Config = {
    "ra.test": RaPlatformMonitorGrid,
    "ra.test.a": RaPlatformMonitorGrid,
    "ra.platform.monitor.app.launcher": RaPlatformMonitorLauncher,
    "ra.platform.monitor": RaPlatformMonitorLogin,
};

@NgModule({
    imports: [
        CommonModule,
        MonitorModule,
        // RaLayoutModule,
        DockableModule,
        LayoutModule.forRoot(environment),
        MonitorAuthLazyModule,
        SharedModule,
        FDC3Module.forRoot(fdc3Components),
        GoldenLayoutModule.forRoot(config),
        RaWebAgentModule,
    ],
    declarations: [
        AppLauncherComponent,
    ],
    exports: [
        AppLauncherComponent,
    ],
    entryComponents: [
        AppLauncherComponent,
    ],
    providers: [
        AppsService,
        LauncherMenuItemsService,
        {
            provide: STORE_MODULE,
            useValue: "fdc3",
        },
        {
            provide: GoldenLayoutStateStore,
            useClass: RestLayoutStateService,
        },
        {
            provide: LayoutMenuItemsService,
            useExisting: LauncherMenuItemsService,
        }
    ]
})
export class AppsModule {

    constructor(
        private appsService: AppsService,
    ) {
        this.appsService.initFDC3Services(fdc3Components);
    }

}
