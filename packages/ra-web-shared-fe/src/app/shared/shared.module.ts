import { NgModule, Optional, SkipSelf, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { RangeDatePipe } from "./pipes/date-range.pipe";
import { EnumToArrayPipe } from "./pipes/enum-to-array.pipe";
import { DefaultPipe } from "./pipes/default.pipe";
import { LookupValuePipe } from "./pipes/lookup-value.pipe";
import { EnumValuePipe } from "./pipes/enum-value.pipe";
import { DisableControlDirective } from "./directives/disable-control.directive";
import { FormatBalancePipe } from "./pipes/format-balance.pipe";
import { ActionBarComponent } from "./action-bar/action-bar.component";
import { DropDownComponent } from "./dropdown/dropdown.component";
import { TranslateModule } from "@ngx-translate/core";
import { MaterialModule } from "@ra/web-material-fe";
import { DraggableDirective } from "./directives/draggable.directive";
import { DateRangeComponent } from "./date-range/date-range.component";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { ImgButtonComponent } from "./img-button/img-button.component";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { InputDialogComponent } from "./input-dialog/input-dialog.component";
import { AdDirective } from "./directives/ad.directive";
import { LoggerService } from "./logger/logger.service";
import { ENVIRONMENT } from "./environment/environment.interface";
import { EnvironmentInterface } from "./environment/environment.interface";
import { RaPressKDirective } from "./directives/press-key.directive";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        TranslateModule,
        ReactiveFormsModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
    ],
    declarations: [
        RangeDatePipe,
        EnumToArrayPipe,
        DefaultPipe,
        LookupValuePipe,
        EnumValuePipe,
        FormatBalancePipe,
        DisableControlDirective,
        DraggableDirective,
        RaPressKDirective,
        AdDirective,
        ActionBarComponent,
        DropDownComponent,
        DateRangeComponent,
        ImgButtonComponent,
        ConfirmDialogComponent,
        InputDialogComponent,
    ],
    providers: [
        LoggerService,
    ],
    entryComponents: [
        ConfirmDialogComponent,
        InputDialogComponent,
    ],
    exports: [
        RangeDatePipe,
        EnumToArrayPipe,
        DefaultPipe,
        LookupValuePipe,
        EnumValuePipe,
        FormatBalancePipe,
        DisableControlDirective,
        DraggableDirective,
        RaPressKDirective,
        AdDirective,
        ActionBarComponent,
        DropDownComponent,
        DateRangeComponent,
        ImgButtonComponent,
    ]
})

export class SharedModule {
    static forRoot(config: EnvironmentInterface): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                {
                    provide: ENVIRONMENT,
                    useValue: config
                }
            ]
        };
    }
}

