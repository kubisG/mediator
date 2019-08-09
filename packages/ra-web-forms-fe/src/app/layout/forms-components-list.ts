import { HubFormsGridComponent } from "../hub-forms/hub-forms-grid/hub-forms-grid.component";
import { HubFormsDetailComponent } from "../hub-forms/hub-forms-detail/hub-forms-detail.component";
import { HubFormsTreeComponent } from "../hub-forms/hub-forms-tree/hub-forms-tree.component";

export const componentsList = [{
    component: HubFormsGridComponent,
    componentName: "ra-hub-forms-grid",
    state: {typ: "TYPLOCATES", label: "Locates" }
},
{
    component: HubFormsGridComponent,
    componentName: "ra-hub-orders-forms-grid",
    state: {typ: "TYPORDERS", label: "Orders" }
},
{
    component: HubFormsGridComponent,
    componentName: "ra-hub-positions-forms-grid",
    state: {typ: "TYPPOSITIONS", label: "Positions" }
},
{
    component: HubFormsGridComponent,
    componentName: "ra-hub-alerts-forms-grid",
    state: {typ: "TYPALERTS", label: "Alerts" }
},
{
    component: HubFormsGridComponent,
    componentName: "ra-hub-execs-forms-grid",
    state: {typ: "TYPEXECUTIONS", label: "Executions" }
},
{
    component: HubFormsDetailComponent,
    componentName: "ra-hub-forms-detail"
},
{
    component: HubFormsTreeComponent,
    componentName: "ra-hub-forms-tree"
},
];
