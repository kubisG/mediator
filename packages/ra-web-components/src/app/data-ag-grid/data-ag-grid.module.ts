import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "@ra/web-material-fe";
import { DataAgGridComponent } from "./data-ag-grid.component";
import { AgGridModule } from "ag-grid-angular";
import { HeaderColumnComponent } from "./header-column/header-column.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MaterialModule,
        AgGridModule.forRoot([HeaderColumnComponent]),
    ],
    providers: [],
    declarations: [
        DataAgGridComponent,
        HeaderColumnComponent,
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
