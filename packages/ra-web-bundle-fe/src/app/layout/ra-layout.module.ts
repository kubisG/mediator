import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { layoutRoutes } from "./layout.routing";
import { HeaderModule, DockableModule, LayoutModule } from "@ra/web-components";
import { DxDataGridModule } from "devextreme-angular";
import {
    GoldenLayoutModule,
    GoldenLayoutConfiguration,
    GoldenLayoutStateStore,
} from "@embedded-enterprises/ng6-golden-layout";
import { MaterialModule } from "@ra/web-material-fe";
import { RaLayoutStateStorage } from "./ra-layout-state-storage";
import { RestModule } from "../rest/rest.module";
import { RestUsersService } from "../rest/rest-users.service";
import { componentsList } from "../components-list";
import { layoutConfig } from "../layout-config";
import { modulesList } from "../modules-list";
import { RaLayoutComponent } from "./ra-layout.component";

const config: GoldenLayoutConfiguration = {
    components: [
        ...componentsList
    ],
    defaultLayout: {
        ...layoutConfig
    }
};

export function DEFAULT_LOCAL_STORAGE_STATE_STORE_FACTORY(restUsersService: RestUsersService) {
    return new RaLayoutStateStorage(restUsersService);
}

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        HeaderModule,
        RestModule,
        RouterModule.forChild(layoutRoutes),
        DxDataGridModule,
        GoldenLayoutModule.forRoot(config),
        DockableModule,
        LayoutModule,
        ...modulesList,
    ],
    declarations: [
        RaLayoutComponent,
    ],
    exports: [],
    entryComponents: [],
    providers: [
        {
            provide: GoldenLayoutStateStore,
            useFactory: DEFAULT_LOCAL_STORAGE_STATE_STORE_FACTORY,
            deps: [RestUsersService]
        },
    ]
})
export class RaLayoutModule { }
