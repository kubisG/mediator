import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "@ra/web-material-fe";
import { DataDxGridComponent } from "./data-dx-grid.component";
import { DxDataGridModule } from "devextreme-angular";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MaterialModule,
        DxDataGridModule,
    ],
    providers: [],
    declarations: [
        DataDxGridComponent,
    ],
    exports: [
        DataDxGridComponent,
    ],
    entryComponents: [
        DataDxGridComponent,
    ]
})
export class DataDxGridModule {

}
