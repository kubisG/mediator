import { NgModule, ModuleWithProviders } from "@angular/core";
import { AuthModule } from "@ra/web-auth-fe";
import { RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { MonitorRestModule } from "../monitor-rest/monitor-rest.module";

@NgModule({
    imports: [
        AuthModule,
        MonitorRestModule,
        RouterModule.forChild([
            { path: "login", component: LoginComponent }
        ])
    ],
    declarations: [
        LoginComponent,
    ],
    providers: []
})
export class MonitorAuthLazyModule {
    forRoot(): ModuleWithProviders {
        return {
            ngModule: MonitorAuthLazyModule,
            providers: []
        };
    }
}
