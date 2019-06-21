import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MaterialModule } from "@ra/web-material-fe";
import { HeaderModule } from "../header/header.module";
import { DockableModule } from "../dockable/dockable.module";
import { LayoutComponent } from "./layout.component";
import { LayoutService } from "./layout.service";
import { LayoutMenuItemsService } from "./layout-menu-items.service";
import { GoldenLayoutModule } from "@embedded-enterprises/ng6-golden-layout";
import { SharedModule, RestModule, EnvironmentInterface, ENVIRONMENT } from "@ra/web-shared-fe";
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        HeaderModule,
        DockableModule,
        GoldenLayoutModule,
        SharedModule,
        RestModule,
    ],
    declarations: [
        LayoutComponent,
    ],
    exports: [
        LayoutComponent,
    ],
    entryComponents: [],
    providers: [
        LayoutService,
        LayoutMenuItemsService,
    ]
})
export class LayoutModule {
    static forRoot(config: EnvironmentInterface): ModuleWithProviders {
        return {
            ngModule: LayoutModule,
            providers: [
                {
                    provide: ENVIRONMENT,
                    useValue: config
                }
            ]
        };
    }
}
