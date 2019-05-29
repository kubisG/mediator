import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { monitorRoutes } from "./layout.routing";
import { HeaderModule, DockableModule } from "@ra/web-components";
import { LayoutMenuItemsService } from "./layout-menu-items.service";
import { DxDataGridModule } from "devextreme-angular";
import {
    GoldenLayoutModule,
    GoldenLayoutConfiguration,
    GoldenLayoutStateStore,
} from "@embedded-enterprises/ng6-golden-layout";
import { MaterialModule } from "@ra/web-material-fe";
import { LayoutStateStorage } from "./layout-state-storage";
import { LayoutComponent } from "./layout.component";
import { LayoutSubHeaderComponent } from "./layout-subheader/layout-subheader.component";
import { RestModule } from "../rest/rest.module";
import { RestUsersService } from "../rest/rest-users.service";
import { componentsList } from "../components-list";
import { modulesList } from "../modules-list";
import { layoutConfig } from "../layout-config";

const config: GoldenLayoutConfiguration = {
    components: [
        ...componentsList
    ],
    defaultLayout: {
        ...layoutConfig
    }
};

export function DEFAULT_LOCAL_STORAGE_STATE_STORE_FACTORY(restUsersService: RestUsersService) {
    return new LayoutStateStorage(restUsersService);
}

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        HeaderModule,
        RestModule,
        RouterModule.forChild(monitorRoutes),
        DxDataGridModule,
        GoldenLayoutModule.forRoot(config),
        DockableModule,
        ...modulesList,
    ],
    declarations: [
        LayoutComponent,
        LayoutSubHeaderComponent,
    ],
    exports: [],
    entryComponents: [],
    providers: [
        LayoutMenuItemsService,
        {
            provide: GoldenLayoutStateStore,
            useFactory: DEFAULT_LOCAL_STORAGE_STATE_STORE_FACTORY,
            deps: [RestUsersService]
        },
    ]
})
export class LayoutModule { }
