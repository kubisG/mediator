
import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ColorPickerModule } from "ngx-color-picker";
import { DxDataGridModule } from "devextreme-angular/ui/data-grid";
import { routes } from "./settings-layout/layout.routing";
import { DockableModule, LayoutModule, DataGridModule } from "@ra/web-components";
import { MaterialModule } from "@ra/web-material-fe";
import {
    GoldenLayoutModule,
    GoldenLayoutConfiguration,
    GoldenLayoutStateStore,
} from "@embedded-enterprises/ng6-golden-layout";
import { LayoutComponent } from "./settings-layout/layout.component";
import { SettingsComponent } from "./settings/settings.component";
import { PasswordChangeComponent } from "./password-change/password-change.component";
import { DialogCurrencyComponent } from "./dialog-currency/dialog-currency.component";
import { SharedModule } from "@ra/web-shared-fe";
import { DialogAccountsComponent } from "./dialog-accounts/dialog-accounts.component";
import { AccountsComponent } from "./accounts/accounts.component";
import { SoundsComponent } from "./sounds/sounds.component";
import { DialogCounterPartyComponent } from "./dialog-counter-party/dialog-counter-party.component";
import { CounterPartyComponent } from "./counter-party/counter-party.component";
import { CompanyWideComponent } from "./company-wide/company-wide.component";
import { DataDxGridModule } from "../data-grid/data-grid.module";
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule, PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { settingsComponentList } from "./settings-component-list";
import { OmsCoreModule } from "../oms-core/oms-core.module";
import { STORE_MODULE, RestLayoutStateService } from "../oms-core/rest-layout-state.service";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

const config: GoldenLayoutConfiguration = {
    components: [...settingsComponentList],
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
        SharedModule,
        ReactiveFormsModule,
        ColorPickerModule,
        FormsModule,
        DockableModule,
        OmsCoreModule,
        MaterialModule,
        RouterModule.forChild(routes),
        DxDataGridModule,
        DataDxGridModule,
        DataGridModule,
        LayoutModule,
        PerfectScrollbarModule,
        GoldenLayoutModule.forRoot(config),
        ReactiveFormsModule,
        TranslateModule,
    ],
    exports: [],
    declarations: [
        LayoutComponent,
        PasswordChangeComponent,
        CompanyWideComponent,
        DialogCurrencyComponent,
        DialogAccountsComponent,
        DialogCounterPartyComponent,
        CounterPartyComponent,
        AccountsComponent,
        SettingsComponent,
        SoundsComponent,
    ],
    entryComponents: [
        DialogCurrencyComponent,
        DialogAccountsComponent,
        DialogCounterPartyComponent,
        CounterPartyComponent,
        AccountsComponent,
        SettingsComponent,
        SoundsComponent,
        CompanyWideComponent,
        PasswordChangeComponent,
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        {
            provide: STORE_MODULE,
            useValue: "settings",
        },
        {
            provide: GoldenLayoutStateStore,
            useClass: RestLayoutStateService,
        },
    ]
})
export class SettingsLayoutModule {
    constructor(@Optional() @SkipSelf() parentModule: SettingsLayoutModule) {
        if (parentModule) {
            throw new Error(
                "SettingsLayoutModule is already loaded. Import it in the AppModule only");
        }
    }
}
