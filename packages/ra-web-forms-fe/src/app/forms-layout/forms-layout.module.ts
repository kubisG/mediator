import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { routes } from "./forms-layout.routing";
import {
    HeaderModule, DockableModule, LayoutModule, RestLayoutStateService, STORE_MODULE
    , LayoutMenuItemsService,
    RaWebAgentModule
} from "@ra/web-components";
import {
    GoldenLayoutModule,
    GoldenLayoutConfiguration,
    GoldenLayoutStateStore,
} from "@embedded-enterprises/ng6-golden-layout";
import { MaterialModule } from "@ra/web-material-fe";
import { FormsLayoutComponent } from "./forms-layout.component";
import { HubFormsModule } from "../hub-forms/hub-forms.module";
import { componentsList } from "./forms-components-list";
import { environment } from "../../environments/environment";
import { FormsMenuItemsService } from "./forms-menu-items.service";

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
        HubFormsModule,
        LayoutModule.forRoot(environment),
        GoldenLayoutModule.forRoot(config),
        RaWebAgentModule,
    ],
    declarations: [
        FormsLayoutComponent,
    ],
    exports: [],
    entryComponents: [],
    providers: [
        FormsMenuItemsService,
        {
            provide: STORE_MODULE,
            useValue: "forms",
        },
        {
            provide: GoldenLayoutStateStore,
            useClass: RestLayoutStateService,
        },
        {
            provide: LayoutMenuItemsService,
            useExisting: FormsMenuItemsService,
        }
    ]
})
export class FormsLayoutModule { }
