import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { layoutRoutes } from "./layout.routing";
import {
    HeaderModule,
    DockableModule,
    LayoutModule,
    RestLayoutStateService,
    LayoutMenuItemsService,
    RaWebAgentModule
} from "@ra/web-components";
import { DxDataGridModule } from "devextreme-angular";
import {
    GoldenLayoutModule,
    GoldenLayoutConfiguration,
    GoldenLayoutStateStore,
} from "@embedded-enterprises/ng6-golden-layout";
import { MaterialModule } from "@ra/web-material-fe";
import { RaLayoutComponent } from "./ra-layout.component";
import { MonitorModule } from "../monitor/monitor.module";
import { componentsList } from "./components-list";
import { STORE_MODULE } from "@ra/web-components";
import { environment } from "../../environments/environment";
import { MonitorMenuItemsService } from "./monitor-menu-items.service";

const config: GoldenLayoutConfiguration = {
    components: [
        ...componentsList
    ],
    defaultLayout: {
        content: [{
            type: "stack",
            isClosable: false,
            content: []
        }]
    }
};

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        HeaderModule,
        RouterModule.forChild(layoutRoutes),
        DxDataGridModule,
        GoldenLayoutModule.forRoot(config),
        DockableModule,
        LayoutModule.forRoot(environment),
        MonitorModule,
        RaWebAgentModule,
    ],
    declarations: [
        RaLayoutComponent,
    ],
    exports: [],
    entryComponents: [

    ],
    providers: [
        MonitorMenuItemsService,
        {
            provide: STORE_MODULE,
            useValue: "monitor",
        },
        {
            provide: GoldenLayoutStateStore,
            useClass: RestLayoutStateService,
        },
        {
            provide: LayoutMenuItemsService,
            useExisting: MonitorMenuItemsService,
        }
    ]
})
export class RaLayoutModule { }
