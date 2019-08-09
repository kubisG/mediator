import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MaterialModule } from "@ra/web-material-fe";
import { StoresListService } from "./stores-list/stores-list.service";
import { StoresListComponent } from "./stores-list/stores-list.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
    ],
    declarations: [
        StoresListComponent,
    ],
    exports: [
        StoresListComponent,
    ],
    entryComponents: [],
    providers: [
        StoresListService,
    ]
})
export class MonitorCore { }
