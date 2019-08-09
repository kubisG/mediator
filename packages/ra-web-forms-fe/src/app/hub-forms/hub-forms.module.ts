import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HubFormsGridComponent } from "./hub-forms-grid/hub-forms-grid.component";
import { FormlyModule } from "@ngx-formly/core";
import { MaterialModule } from "@ra/web-material-fe";
import { FormlyMatDatepickerModule } from "@ngx-formly/material/datepicker";
import { FormlyMatInputModule } from "@ngx-formly/material/input";
import { FormlyMatSelectModule } from "@ngx-formly/material/select";

import { MatNativeDateModule } from "@angular/material/core";
import { HubFormsDialogComponent } from "./hub-forms-dialog/hub-forms-dialog.component";
import { HubFormsService } from "./hub-forms.service";
import { SystemChannelModule } from "../system-channel/system-channel.module";
import { FormsRestModule } from "../rest/forms-rest.module";
import { HubFormsDetailComponent } from "./hub-forms-detail/hub-forms-detail.component";
import { TransformDataPipe } from "./transform-data.pipe";
import { DataGridModule, DataExchangeModule } from "@ra/web-components";
import { HubFormsTabComponent } from "./hub-forms-tab/hub-forms-tab.component";
import { HubFormsTreeComponent } from "./hub-forms-tree/hub-forms-tree.component";
import { HubFormsHeaderComponent } from "./hub-forms-header/hub-forms-header.component";
import { RepeatTypeComponent } from "./hub-ngx-types/repeat-type/repeat-type.component";
import { LoggerService, ENVIRONMENT, SharedModule } from "@ra/web-shared-fe";
import { environment } from "../../environments/environment";
import { ExternalListComponent } from "./hub-ngx-types/external-list/external-list.component";
import { HubFormsOverviewComponent } from "./hub-forms-overview/hub-forms-overview.component";
import { MonacoEditorModule } from "ngx-monaco-editor";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

export function minlengthValidationMessage(err, field) {
    return `Should have atleast ${field.templateOptions.minLength} characters`;
}

export function maxlengthValidationMessage(err, field) {
    return `This value should be less than ${field.templateOptions.maxLength} characters`;
}

export function minValidationMessage(err, field) {
    return `This value should be more than ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field) {
    return `This value should be less than ${field.templateOptions.max}`;
}

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        DataExchangeModule,
        FormlyModule.forRoot({
            validationMessages: [
                { name: "required", message: "This field is required" },
                { name: "minlength", message: minlengthValidationMessage },
                { name: "maxlength", message: maxlengthValidationMessage },
                { name: "min", message: minValidationMessage },
                { name: "max", message: maxValidationMessage },
            ],
            types: [
                { name: "repeat", component: RepeatTypeComponent },
                { name: "externalList", component: ExternalListComponent },
            ],
        }),
        MatNativeDateModule,
        PerfectScrollbarModule,
        FormlyMatDatepickerModule,
        FormlyMatInputModule,
        FormlyMatSelectModule,
        MaterialModule,
        SharedModule,
        DataGridModule,
        FormsRestModule,
        SystemChannelModule,
        MonacoEditorModule.forRoot(),
    ],
    providers: [
        HubFormsService,
        LoggerService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        {
            provide: ENVIRONMENT,
            useValue: environment
        }
    ],
    declarations: [
        HubFormsGridComponent,
        HubFormsDialogComponent,
        HubFormsDetailComponent,
        HubFormsTabComponent,
        HubFormsHeaderComponent,
        HubFormsTreeComponent,
        HubFormsOverviewComponent,
        RepeatTypeComponent,
        ExternalListComponent,
        TransformDataPipe,
    ],
    entryComponents: [
        HubFormsDialogComponent,
        HubFormsGridComponent,
        HubFormsDetailComponent,
        HubFormsHeaderComponent,
        HubFormsOverviewComponent,
        HubFormsTabComponent,
        HubFormsTreeComponent,
    ]
})
export class HubFormsModule { }
