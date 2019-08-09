import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
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
import { AppsService } from "./apps.service";
import { RaPlatformFormsLauncher } from "./ra-platform-forms-launcher";
import { RaPlatformFormsLogin } from "./ra-platform-forms-login";
import { RaPlatformFormsGrid } from "./ra-platform-forms-grid";
import { FDC3Config } from "@ra/web-components";
import { LauncherMenuItemsService } from "./launcher-menu-items.service";
import { environment } from "../../environments/environment";
import { AppLauncherComponent } from "./app-launcher/app-launcher.component";
import { HubFormsModule } from "../hub-forms/hub-forms.module";
import { HubFormsAuthLazyModule } from "../hub-forms-auth/hub-forms-auth-lazy.module";
import { RaPlatformFormsDetail } from "./ra-platform-forms-detail";

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
    "ra.platform.forms.grid": RaPlatformFormsGrid,
    "ra.platform.forms.detail": RaPlatformFormsDetail,
    "ra.platform.forms.app.launcher": RaPlatformFormsLauncher,
    "ra.platform.forms": RaPlatformFormsLogin,
};

@NgModule({
    imports: [
        CommonModule,
        HubFormsModule,
        DockableModule,
        LayoutModule.forRoot(environment),
        HubFormsAuthLazyModule,
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
