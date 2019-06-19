import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MaterialModule } from "@ra/web-material-fe";
import { GoldenLayoutModule } from "@embedded-enterprises/ng6-golden-layout";
import { SharedModule } from "@ra/web-shared-fe";
import { PreferencesComponent } from "./preferences.component";
import { RestPreferencesService } from "../rest/rest-preferences.service";
import { DataGridModule, DockableModule } from "@ra/web-components";
import { PreferencesDialogComponent } from "./preferences-dialog/preferences-dialog.component";
import { RestUsersService } from "../rest/rest-users.service";
import { RestCompaniesService } from "../rest/rest-companies.service";
import { TranslateModule } from "@ngx-translate/core";
import { MonacoEditorModule } from "ngx-monaco-editor";
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule, PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";


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
        MonacoEditorModule,
        DockableModule,
        SharedModule,
        PerfectScrollbarModule,
    ],
    declarations: [
        PreferencesComponent,
        PreferencesDialogComponent
    ],
    exports: [
        PreferencesComponent,
    ],
    entryComponents: [
        PreferencesDialogComponent,
        PreferencesComponent
    ],
    providers: [
        RestPreferencesService,
        RestCompaniesService,
        RestUsersService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
    ]
})
export class PreferencesModule { }
