import { NgModule, Optional, SkipSelf } from "@angular/core";
import { SharedModule } from "@ra/web-shared-fe";
import { CommonModule } from "@angular/common";
import { LayoutModule, LayoutMenuItemsService } from "@ra/web-components";
import { AppMenuItemsService } from "./app-menu-items.service";

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        LayoutModule,
    ],
    declarations: [
    ],
    exports: [
    ],
    providers: [
        AppMenuItemsService,
        {
            provide: LayoutMenuItemsService,
            useExisting: AppMenuItemsService
        },
    ],
    entryComponents: [
    ]
})
export class OmsCoreModule {
    constructor(@Optional() @SkipSelf() parentModule: OmsCoreModule) {
        if (parentModule) {
            throw new Error(
                "OmsCoreModule is already loaded. Import it in the AppModule only");
        }
    }
}
