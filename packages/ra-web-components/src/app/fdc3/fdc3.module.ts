import { NgModule, ModuleWithProviders, Type } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@ra/web-shared-fe";
import { FDC3Component, FDC3_COMPONENTS } from "./fdc3.component";
import { FDC3Config } from "./fdc3-config.interface";
import { FDC3Service } from "./fdc3.service";
import { FDC3ProvidersFactoryService } from "./providers/fdc3-providers-factory.service";
import { LayoutModule } from "../layout/layout.module";
import { FDC3HeaderComponent } from "./fdc3-header/fdc3-header.component";
import { MaterialModule } from "@ra/web-material-fe";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        LayoutModule,
        MaterialModule,
        RouterModule.forChild([
            { path: ":appId", component: FDC3Component }
        ])
    ],
    declarations: [
        FDC3Component,
        FDC3HeaderComponent,
    ],
    exports: [
        FDC3Component,
        FDC3HeaderComponent,
    ],
    entryComponents: [],
    providers: [
        FDC3Service,
        FDC3ProvidersFactoryService,
    ]
})
export class FDC3Module {
    static forRoot(components: FDC3Config): ModuleWithProviders {
        return {
            ngModule: FDC3Module,
            providers: [
                FDC3Service,
                {
                    provide: FDC3_COMPONENTS,
                    useValue: components,
                }
            ]
        };
    }
}
