import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "@ra/web-material-fe";
import { DataAgGridComponent } from "./data-ag-grid.component";
import { AgGridModule } from "ag-grid-angular";
import { HeaderColumnComponent } from "./header-column/header-column.component";
import { SelectEditorComponent } from "./select-editor/select-editor.component";
import { NumberEditorComponent } from "./number-editor/number-editor.component";
import { NgxMaskModule } from "ngx-mask";
import { BackendFilterComponent } from "./backend-filter/backend-filter.component";
import { StoreQueriyngModule } from "../store-querying/store-querying.module";
import { StartWithComponent } from "./backend-filter/start-with/start-with.component";
import { BetweenComponent } from "./backend-filter/between/between.component";
import { ContainsComponent } from "./backend-filter/contains/contains.component";
import { EndWithComponent } from "./backend-filter/end-with/end-with.component";
import { EqualComponent } from "./backend-filter/equal/equal.component";
import { GreaterComponent } from "./backend-filter/greater/greater.component";
import { GreateOrEqualComponent } from "./backend-filter/greater-or-equal/greater-or-equal.component";
import { InComponent } from "./backend-filter/in/in.component";
import { LessComponent } from "./backend-filter/less/less.component";
import { LessOrEqualComponent } from "./backend-filter/less-or-equal/less-or-equal.component";
import { NotComponent } from "./backend-filter/not/not.component";
import { NotEqualComponent } from "./backend-filter/not-equal/not-equal.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MaterialModule,
        NgxMaskModule,
        StoreQueriyngModule,
        AgGridModule.forRoot([
            HeaderColumnComponent,
            SelectEditorComponent,
            NumberEditorComponent,
            BackendFilterComponent
        ]),
    ],
    providers: [],
    declarations: [
        DataAgGridComponent,
        HeaderColumnComponent,
        SelectEditorComponent,
        NumberEditorComponent,
        BackendFilterComponent,
        StartWithComponent,
        BetweenComponent,
        ContainsComponent,
        EndWithComponent,
        EqualComponent,
        GreaterComponent,
        GreateOrEqualComponent,
        InComponent,
        LessComponent,
        LessOrEqualComponent,
        NotComponent,
        NotEqualComponent,
    ],
    exports: [
        DataAgGridComponent,
    ],
    entryComponents: [
        DataAgGridComponent,
    ]
})
export class DataAgGridModule {

}
