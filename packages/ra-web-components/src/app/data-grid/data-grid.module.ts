import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "@ra/web-material-fe";
import { DataDxGridModule } from "../data-dx-grid/data-dx-grid.module";
import { DataGridComponent } from "./data-grid.component";
import { DataAgGridModule } from "../data-ag-grid/data-ag-grid.module";
import { SharedModule } from "@ra/web-shared-fe";
import { DATA_GRID_COMPONENTS } from "./data-grid-components-map.interface";
import { DataAgGridComponent } from "../data-ag-grid/data-ag-grid.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MaterialModule,
        SharedModule,
        DataDxGridModule,
        DataAgGridModule,
    ],
    providers: [
        {
            provide: DATA_GRID_COMPONENTS,
            useValue: {
                default: DataAgGridComponent,
            }
        }
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
