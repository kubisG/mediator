import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MonitorDataService } from "./monitor-data.service";
import { MaterialModule } from "@ra/web-material-fe";
import { MonitorDialogComponent } from "./monitor-dialog/monitor-dialog.component";
import { DataGridModule, DockableModule, DataAgGridModule } from "@ra/web-components";
import { MonitorTabComponent } from "./monitor-tab/monitor-tab.component";
import { MonitorGridComponent } from "./monitor-grid/monitor-grid.component";
import { ENVIRONMENT } from "@ra/web-shared-fe";
import { environment } from "../../environments/environment";
import { MonitorCore } from "../monitor-core/monitor-core.module";
import { StoreQueriyngModule } from "@ra/web-components";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MonitorCore,
        MaterialModule,
        DataGridModule,
        DockableModule,
        DataAgGridModule,
        StoreQueriyngModule,
    ],
    declarations: [
        MonitorGridComponent,
        MonitorDialogComponent,
        MonitorTabComponent,
    ],
    exports: [
        MonitorGridComponent,
        MonitorTabComponent,
    ],
    entryComponents: [
        MonitorGridComponent,
        MonitorTabComponent,
    ],
    providers: [
        MonitorDataService,
        {
            provide: ENVIRONMENT,
            useValue: environment,
        },
    ]
})
export class MonitorModule {

}
