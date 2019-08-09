import { DiagServerComponent } from "./diag-server/diag-server.component";
import { DiagHubComponent } from "./diag-hub/diag-hub.component";

export const diagnosticComponentList = [{
    componentName: "ra-diag-hub", component: DiagHubComponent
},
{
    componentName: "ra-diag-server", component: DiagServerComponent,
}
];
