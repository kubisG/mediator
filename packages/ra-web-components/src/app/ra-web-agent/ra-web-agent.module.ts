import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "@ra/web-material-fe";
import { RaWebAgentService } from "./ra-web-agent.service";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MaterialModule,
    ],
    providers: [
        RaWebAgentService,
    ],
    declarations: [

    ],
    exports: [

    ]
})
export class RaWebAgentModule {

}
