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
import { UsersComponent } from "./users.component";
import { DialogUserComponent } from "./dialog-user/dialog-user.component";
import { DxDataGridModule } from "devextreme-angular";
import { ENVIRONMENT } from "@ra/web-shared-fe";

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
        DxDataGridModule,
        GoldenLayoutModule,
        DockableModule,
        SharedModule,
        PerfectScrollbarModule,
    ],
    declarations: [
        UsersComponent,
        DialogUserComponent
    ],
    exports: [
        UsersComponent,
    ],
    entryComponents: [
        DialogUserComponent,
        UsersComponent
    ],
    providers: [
        RestCompaniesService,
        DialogUserComponent,
        RestUsersService,
        LoggerService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
    ]
})
export class UsersModule {
    static forRoot(config: EnvironmentInterface): ModuleWithProviders {
        return {
            ngModule: UsersModule,
            providers: [
                {
                    provide: ENVIRONMENT,
                    useValue: config
                }
            ]
        };
    }
}
