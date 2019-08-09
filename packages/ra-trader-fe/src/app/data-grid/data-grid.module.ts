import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataGridService } from "./data-grid.service";
import { DxDataGridModule } from "devextreme-angular/ui/data-grid";

@NgModule({
    imports: [
        CommonModule,
        DxDataGridModule,
    ],
    declarations: [
    ],
    exports: [
    ],
    providers: [
        DataGridService,
    ]
})
export class DataDxGridModule { }
