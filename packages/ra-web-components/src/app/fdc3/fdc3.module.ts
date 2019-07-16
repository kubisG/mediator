import { NgModule, ModuleWithProviders, Type } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@ra/web-shared-fe";
import { FDC3Component, FDC3_COMPONENTS } from "./fdc3.component";
import { FDC3Config } from "./fdc3-config.interface";
import { FDC3Service } from "./fdc3.service";
import { FDC3ProvidersFactoryService } from "./providers/fdc3-providers-factory.service";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            { path: ":appId", component: FDC3Component }
        ])
    ],
    declarations: [
        FDC3Component,
    ],
    exports: [
        FDC3Component,
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
