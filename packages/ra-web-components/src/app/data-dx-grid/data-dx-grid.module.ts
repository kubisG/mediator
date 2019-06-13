import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "@ra/web-material-fe";
import { DataDxGridComponent } from "./data-dx-grid.component";
import { DxDataGridModule } from "devextreme-angular";
import { DataDxGridService } from "./data-dx-grid.service";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MaterialModule,
        DxDataGridModule,
    ],
    providers: [
        DataDxGridService,
    ],
    declarations: [
        DataDxGridComponent,
    ],
    exports: [
        DataDxGridComponent,
    ]
})
export class DataDxGridModule {

}
