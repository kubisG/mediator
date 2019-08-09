import { NgModule, SkipSelf, Optional } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { routes } from "./diagnostics-layout/layout.routing";
import { HeaderModule, DockableModule, LayoutModule } from "@ra/web-components";
import {
    GoldenLayoutModule,
    GoldenLayoutConfiguration,
    GoldenLayoutStateStore,
} from "@embedded-enterprises/ng6-golden-layout";
import { LayoutComponent } from "./diagnostics-layout/layout.component";
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule, PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

import { SharedModule } from "@ra/web-shared-fe";
import { NgxMaskModule } from "ngx-mask";
import { MaterialModule } from "@ra/web-material-fe";
import { DiagHubComponent } from "./diag-hub/diag-hub.component";
import { DiagServerComponent } from "./diag-server/diag-server.component";
import { diagnosticComponentList } from "./diagnostic-list";
import { OmsCoreModule } from "../oms-core/oms-core.module";
import { STORE_MODULE, RestLayoutStateService } from "../oms-core/rest-layout-state.service";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

const config: GoldenLayoutConfiguration = {
    components: [...diagnosticComponentList
    ],
    defaultLayout: {
        settings: {
            hasHeaders: true,
            constrainDragToContainer: true,
            reorderEnabled: true,
            selectionEnabled: false,
            popoutWholeStack: true,
            blockedPopoutsThrowError: true,
            closePopoutsOnUnload: true,
            showPopoutIcon: true,
            showMaximiseIcon: true,
            showCloseIcon: true
        },
        content: [{
            type: "stack",
            isClosable: false,
            content: []
        }]
    }
};


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        FormsModule,
        HeaderModule,
        DockableModule,
        LayoutModule,
        OmsCoreModule,
        TranslateModule,
        MaterialModule,
        NgxMaskModule.forRoot(),
        RouterModule.forChild(routes),
        PerfectScrollbarModule,
        GoldenLayoutModule.forRoot(config),
    ],
    declarations: [
        LayoutComponent,
        DiagHubComponent,
        DiagServerComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        {
            provide: STORE_MODULE,
            useValue: "diagnostic",
        },
        {
            provide: GoldenLayoutStateStore,
            useClass: RestLayoutStateService,
        },
    ],
    entryComponents: [
        DiagHubComponent,
        DiagServerComponent
    ]
})
export class DiagnosticsModule {
    constructor(@Optional() @SkipSelf() parentModule: DiagnosticsModule) {
        if (parentModule) {
            throw new Error(
                "DiagnosticsModule is already loaded. Import it in the AppModule only");
        }
    }
}
