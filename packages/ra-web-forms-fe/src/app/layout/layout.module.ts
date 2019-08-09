import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { routes } from "./layout.routing";
import { HeaderModule, DockableModule, LayoutModule, RestLayoutStateService, STORE_MODULE } from "@ra/web-components";
import { DxDataGridModule } from "devextreme-angular";
import {
    GoldenLayoutModule,
    GoldenLayoutConfiguration,
    GoldenLayoutStateStore,
} from "@embedded-enterprises/ng6-golden-layout";
import { MaterialModule } from "@ra/web-material-fe";
import { LayoutComponent } from "./layout.component";
import { HubFormsModule } from "../hub-forms/hub-forms.module";
import { componentsList } from "./forms-components-list";
import { environment } from "../../environments/environment";

const config: GoldenLayoutConfiguration = {
    components: [...componentsList],
    defaultLayout: {
        settings: {
            hasHeaders: true,
            constrainDragToContainer: true,
            reorderEnabled: true,
            selectionEnabled: false,
            popoutWholeStack: false,
            blockedPopoutsThrowError: true,
            closePopoutsOnUnload: true,
            showPopoutIcon: true,
            showMaximiseIcon: true,
            showCloseIcon: true
        },
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
        DockableModule,
        HeaderModule,
        RouterModule.forChild(routes),
        DxDataGridModule,
        HubFormsModule,
        LayoutModule.forRoot(environment),
        GoldenLayoutModule.forRoot(config),
    ],
    declarations: [
        LayoutComponent,
    ],
    exports: [],
    entryComponents: [],
    providers: [
        {
            provide: STORE_MODULE,
            useValue: "forms",
        },
        {
            provide: GoldenLayoutStateStore,
            useClass: RestLayoutStateService,
        }
    ]
})
export class FormsLayoutModule { }
