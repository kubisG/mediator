import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MaterialModule } from "@ra/web-material-fe";
import { GoldenLayoutModule } from "@embedded-enterprises/ng6-golden-layout";
import { SharedModule, LoggerService, EnvironmentInterface } from "@ra/web-shared-fe";
import { DataGridModule, DockableModule } from "@ra/web-components";
import { RestUsersService } from "../rest/rest-users.service";
import { RestCompaniesService } from "../rest/rest-companies.service";
import { TranslateModule } from "@ngx-translate/core";
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule, PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { CompaniesComponent } from "./companies.component";
import { DialogCompanyComponent } from "./dialog-company/dialog-company.component";
import { ENVIRONMENT } from "@ra/web-shared-fe";
import { environment } from "../../environments/environment";


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        DataGridModule,
        TranslateModule,
        GoldenLayoutModule,
        DockableModule,
        SharedModule,
        PerfectScrollbarModule,
    ],
    declarations: [
        CompaniesComponent,
        DialogCompanyComponent
    ],
    exports: [
        CompaniesComponent,
    ],
    entryComponents: [
        DialogCompanyComponent,
        CompaniesComponent
    ],
    providers: [
        RestCompaniesService,
        RestUsersService,
        LoggerService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        {
            provide: ENVIRONMENT,
            useValue: environment
        },
    ]
})
export class CompaniesModule {
    static forRoot(config: EnvironmentInterface): ModuleWithProviders {
        return {
            ngModule: CompaniesModule,
            providers: [
                {
                    provide: ENVIRONMENT,
                    useValue: config
                }
            ]
        };
    }
}
