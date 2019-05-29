import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "@ra/web-material-fe";
import { DataGridComponent } from "./data-grid.component";
import { DxDataGridModule } from "devextreme-angular";
import { DataGridService } from "./data-grid.service";

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
        DataGridService,
    ],
    declarations: [
        DataGridComponent,
    ],
    exports: [
        DataGridComponent,
    ]
})
export class DataGridModule {

}
