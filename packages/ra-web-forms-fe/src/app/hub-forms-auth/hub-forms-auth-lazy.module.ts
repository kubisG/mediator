import { NgModule } from "@angular/core";
import { AuthModule } from "@ra/web-auth-fe";
import { FormsRestModule } from "../rest/forms-rest.module";
import { RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";

@NgModule({
    imports: [
        AuthModule,
        FormsRestModule,
        RouterModule.forChild([
            { path: "login", component: LoginComponent }
        ])
    ],
    declarations: [
        LoginComponent,
    ],
    providers: []
})
export class HubFormsAuthLazyModule { }
