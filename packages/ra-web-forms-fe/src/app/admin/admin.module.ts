import { NgModule, SkipSelf, Optional } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { routes } from "./admin-layout/layout.routing";
import { HeaderModule, DockableModule, LayoutModule, RestLayoutStateService, STORE_MODULE, DataGridModule } from "@ra/web-components";
import {
    GoldenLayoutModule,
    GoldenLayoutConfiguration,
    GoldenLayoutStateStore,
} from "@embedded-enterprises/ng6-golden-layout";
import { LayoutComponent } from "./admin-layout/layout.component";
import { MonacoEditorModule } from "ngx-monaco-editor";
import { MaterialModule } from "@ra/web-material-fe";
import { FormsSpecComponent } from "./forms-spec/forms-spec.component";
import { FormsSpecDialogComponent } from "./forms-spec-dialog/forms-spec-dialog.component";
import { componentsList } from "./admin-components-list";
import { PreferencesModule, UsersModule, CompaniesModule } from "@ra/web-admin-fe";
import { environment } from "../../environments/environment";
import { SharedModule } from "@ra/web-shared-fe";


const config: GoldenLayoutConfiguration = {
    components: [...componentsList],
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
        FormsModule,
        MaterialModule,
        SharedModule,
        DockableModule,
        HeaderModule,
        RouterModule.forChild(routes),
        TranslateModule,
        DataGridModule,
        CompaniesModule.forRoot(environment),
        PreferencesModule.forRoot(environment),
        UsersModule.forRoot(environment),
        GoldenLayoutModule.forRoot(config),
        MonacoEditorModule.forRoot(),
        LayoutModule.forRoot(environment),
    ],
    declarations: [
        LayoutComponent,
        FormsSpecComponent,
        FormsSpecDialogComponent,
    ],
    providers: [
        {
            provide: STORE_MODULE,
            useValue: "admin",
        },
        {
            provide: GoldenLayoutStateStore,
            useClass: RestLayoutStateService,
        }
    ],
    entryComponents: [
        FormsSpecDialogComponent,
        FormsSpecComponent,
    ],
    exports: [
        FormsSpecComponent,
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

