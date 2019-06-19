import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MaterialModule } from "@ra/web-material-fe";
import { GoldenLayoutModule } from "@embedded-enterprises/ng6-golden-layout";
import { SharedModule, LoggerService } from "@ra/web-shared-fe";
import { RestPreferencesService } from "../rest/rest-preferences.service";
import { DataGridModule, DockableModule } from "@ra/web-components";
import { RestUsersService } from "../rest/rest-users.service";
import { RestCompaniesService } from "../rest/rest-companies.service";
import { TranslateModule } from "@ngx-translate/core";
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule, PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { CompaniesComponent } from "./companies.component";
import { DialogCompanyComponent } from "./dialog-company/dialog-company.component";


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
        RestPreferencesService,
        RestCompaniesService,
        RestUsersService,
        LoggerService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
    ]
})
export class CompaniesModule { }
