import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@ra/web-shared-fe";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { MaterialModule } from "@ra/web-material-fe";
import { DxPopupModule } from "devextreme-angular/ui/popup";
import { DxButtonModule } from "devextreme-angular/ui/button";
import { DxTemplateModule } from "devextreme-angular/core/template";
import { LoginFormComponent } from "./login-form/login-form.component";
import { LostPasswordComponent } from './lost-password/lost-password.component';
import { CoreModule } from '@ra/web-core-fe';
@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        MaterialModule,
        DxPopupModule,
        DxButtonModule,
        DxTemplateModule,
    ],
    providers: [],
    declarations: [
        LoginFormComponent,
        LostPasswordComponent,
    ],
    exports: [
        LoginFormComponent,
        LostPasswordComponent,
    ]
})
export class AuthModule { }
