import { NgModule } from "@angular/core";
import { AuthModule } from "@ra/web-auth-fe";
import { RestModule } from "../rest/rest.module";
import { RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";

@NgModule({
    imports: [
        AuthModule,
        RestModule,
        RouterModule.forChild([
            { path: "login", component: LoginComponent }
        ])
    ],
    declarations: [
        LoginComponent,
    ],
    providers: []
})
export class MonitorAuthLazyModule { }
