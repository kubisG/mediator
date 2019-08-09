import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { authenticationRoutes } from "./authentication.routing";
import { LoginFormComponent } from "./login-form/login-form.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { LostPasswordComponent } from "./lost-password/lost-password.component";
import { SharedModule } from "@ra/web-shared-fe";
import { MaterialModule } from "@ra/web-material-fe";

/**
 * TODO : import only used modules
 */
@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        MaterialModule,
        RouterModule.forChild(authenticationRoutes),
    ],
    declarations: [
        LoginFormComponent,
        LostPasswordComponent
    ],
    entryComponents: [
        LostPasswordComponent
    ]
})
export class AuthenticationModule {
    constructor(@Optional() @SkipSelf() parentModule: AuthenticationModule) {
        if (parentModule) {
            throw new Error(
                "AuthenticationModule is already loaded. Import it in the AppModule only");
        }
    }
}
