import { NgModule, SkipSelf, Optional } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { DockableModule, LayoutModule } from "@ra/web-components";
import {
    GoldenLayoutModule,
    GoldenLayoutConfiguration,
    GoldenLayoutStateStore,
} from "@embedded-enterprises/ng6-golden-layout";
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule, PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

import { UsersComponent } from "./users/users.component";
import { DialogUserComponent } from "./dialog-user/dialog-user.component";
import { CompaniesComponent } from "./companies/companies.component";
import { DialogCompanyComponent } from "./dialog-company/dialog-company.component";
import { InputRulesComponent } from "./input-rules/input-rules.component";
import { InputRulesDialogComponent } from "./input-rules-dialog/input-rules-dialog.component";
import { InputRulesAdminService } from "./input-rules/input-rules-admin.service";
import { DxDataGridModule } from "devextreme-angular/ui/data-grid";
import { SharedModule } from "@ra/web-shared-fe";
import { DataDxGridModule } from "../data-grid/data-grid.module";
import { PreferencesComponent } from "./preferences/preferences.component";
import { MonacoEditorModule } from "ngx-monaco-editor";
import { PreferencesDialogComponent } from "./preferences-dialog/preferences-dialog.component";
import { NgxMaskModule } from "ngx-mask";
import { MaterialModule } from "@ra/web-material-fe";
import { adminComponentList } from "./admin-layout/admin-component-list";
import { adminLayoutRoute } from "./admin-layout/admin-layout.routing";
import { AdminLayoutComponent } from "./admin-layout/admin-layout.component";
import { OmsCoreModule } from "../oms-core/oms-core.module";
import { STORE_MODULE, RestLayoutStateService } from "../oms-core/rest-layout-state.service";
import { DataGridModule } from "@ra/web-components";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

const config: GoldenLayoutConfiguration = {
    components: [
        ...adminComponentList,
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
        DockableModule,
        FormsModule,
        OmsCoreModule,
        TranslateModule,
        DxDataGridModule,
        DataGridModule,
        DataDxGridModule,
        MaterialModule,
        NgxMaskModule.forRoot(),
        RouterModule.forChild(adminLayoutRoute),
        PerfectScrollbarModule,
        GoldenLayoutModule.forRoot(config),
        MonacoEditorModule.forRoot(),
        LayoutModule,
    ],
    declarations: [
        AdminLayoutComponent,
        DialogCompanyComponent,
        DialogUserComponent,
        InputRulesDialogComponent,
        UsersComponent,
        CompaniesComponent,
        InputRulesComponent,
        PreferencesComponent,
        PreferencesDialogComponent,
    ],
    providers: [
        InputRulesAdminService,
        {
            provide: STORE_MODULE,
            useValue: "admin",
        },
        {
            provide: GoldenLayoutStateStore,
            useClass: RestLayoutStateService,
        },
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
    ],
    entryComponents: [
        DialogCompanyComponent,
        DialogUserComponent,
        InputRulesDialogComponent,
        PreferencesDialogComponent,
        UsersComponent,
        CompaniesComponent,
        InputRulesComponent,
        PreferencesComponent,
    ]
})
export class AdminLayoutModule {
    constructor(@Optional() @SkipSelf() parentModule: AdminLayoutModule) {
        if (parentModule) {
            throw new Error(
                "AdminLayoutModule is already loaded. Import it in the AppModule only");
        }
    }
}
