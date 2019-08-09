import { NgModule, Optional, SkipSelf } from "@angular/core";
import { PreferencesService } from "./preferences.service";

@NgModule({
    imports: [
    ],
    declarations: [],
    providers: [
        PreferencesService,
    ]
})
export class PreferencesModule {
    constructor(@Optional() @SkipSelf() parentModule: PreferencesModule) {
        if (parentModule) {
            throw new Error(
                "PreferencesModule is already loaded. Import it in the AppModule only");
        }
    }
}
