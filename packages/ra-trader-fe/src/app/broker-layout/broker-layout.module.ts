import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HeaderModule, DockableModule, LayoutModule } from "@ra/web-components";
import { DxDataGridModule } from "devextreme-angular";
import { MaterialModule } from "@ra/web-material-fe";
import {
    GoldenLayoutModule,
    GoldenLayoutConfiguration,
    GoldenLayoutStateStore,
} from "@embedded-enterprises/ng6-golden-layout";
import { OrdersModule } from "../orders/orders.module";
import { BrokerModule } from "../broker/broker.module";
import { BrokerSplitModule } from "../broker-split/broker-split.module";
import { BrokerPhoneModule } from "../broker-phone/broker-phone.module";
import { brokerLayoutRoutes } from "./broker-layout.routing";
import { BrokerLayoutComponent } from "./broker-layout.component";

import { brokerComponentList } from "./broker-component-list";
import { OmsCoreModule } from "../oms-core/oms-core.module";
import { STORE_MODULE, RestLayoutStateService } from "../oms-core/rest-layout-state.service";

const config: GoldenLayoutConfiguration = {
    components: [
        ...brokerComponentList,
    ],
    defaultLayout: {
        settings: {
            hasHeaders: true,
            constrainDragToContainer: true,
            reorderEnabled: true,
            selectionEnabled: false,
            popoutWholeStack: true,
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
        HeaderModule,
        DockableModule,
        MaterialModule,
        OmsCoreModule,
        RouterModule.forChild(brokerLayoutRoutes),
        DxDataGridModule,
        OrdersModule,
        BrokerModule,
        BrokerPhoneModule,
        BrokerSplitModule,
        GoldenLayoutModule.forRoot(config),
        LayoutModule,
    ],
    declarations: [
        BrokerLayoutComponent,
    ],
    exports: [],
    entryComponents: [],
    providers: [
        {
            provide: STORE_MODULE,
            useValue: "broker",
        },
        {
            provide: GoldenLayoutStateStore,
            useClass: RestLayoutStateService,
        },
    ]
})
export class BrokerLayoutModule { }
