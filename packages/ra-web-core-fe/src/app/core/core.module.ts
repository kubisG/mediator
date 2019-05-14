import { NgModule, ModuleWithProviders } from "@angular/core";
import { AuthService } from "./auth/auth.service";

@NgModule({
    imports: [
    ],
    declarations: [
    ],
    exports: [
    ],
    providers: [
    ]
})
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                AuthService,
            ]
        }
    }
}
