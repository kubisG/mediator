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
import { BetweenComponent } from "./backend-filter/between/between.component";
import { InComponent } from "./backend-filter/in/in.component";
import { FunctionOperatorComponent } from "./backend-filter/function-operator/function-operator.component";
import { BinaryOperatorComponent } from "./backend-filter/binary-operator/binary-operator.component";
import { UnaryOperatorComponent } from "./backend-filter/unary-operator/unary-operator.component";

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
        BetweenComponent,
        InComponent,
        FunctionOperatorComponent,
        BinaryOperatorComponent,
        UnaryOperatorComponent,
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
