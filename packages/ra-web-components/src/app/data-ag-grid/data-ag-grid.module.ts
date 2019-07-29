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

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MaterialModule,
        NgxMaskModule,
        AgGridModule.forRoot([HeaderColumnComponent, SelectEditorComponent, NumberEditorComponent ]),
    ],
    providers: [],
    declarations: [
        DataAgGridComponent,
        HeaderColumnComponent,
        SelectEditorComponent,
        NumberEditorComponent,
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
