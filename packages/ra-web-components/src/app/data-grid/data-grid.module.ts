import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "@ra/web-material-fe";
import { DataGridComponent } from "./data-grid.component";
import { DataGridService } from "./data-grid.service";
import { DataDxGridModule } from "../data-dx-grid/data-dx-grid.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MaterialModule,
        DataDxGridModule,
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
