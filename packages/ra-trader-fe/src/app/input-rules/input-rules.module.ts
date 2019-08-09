import { NgModule } from "@angular/core";
import { SharedModule } from "@ra/web-shared-fe";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { InputRulesService } from "./input-rules.service";
import { InputRuleSelectComponent } from "./input-rule-select/input-rule-select.component";
import { MaterialModule } from "@ra/web-material-fe";

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
    ],
    declarations: [
        InputRuleSelectComponent,
    ],
    exports: [
        InputRuleSelectComponent,
    ],
    providers: [
        InputRulesService,
    ],
    entryComponents: [

    ]
})
export class InputRulesModule { }
