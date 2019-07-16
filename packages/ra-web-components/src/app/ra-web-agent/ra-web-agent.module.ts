import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "@ra/web-material-fe";
import { RaWebAgentService } from "./ra-web-agent.service";
import { AppHostComponent } from "./app-host/app-host.component";
import { DockableModule } from "../dockable/dockable.module";
import { RestAppDirectoryService } from "./rest-app-directory.service";
import { LayoutModule } from "../layout/layout.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MaterialModule,
        DockableModule,
        LayoutModule,
    ],
    providers: [
        RaWebAgentService,
        RestAppDirectoryService,
    ],
    declarations: [
        AppHostComponent,
    ],
    exports: [
        AppHostComponent,
    ],
    entryComponents: [
        AppHostComponent,
    ]
})
export class RaWebAgentModule {
    constructor(
        private raWebAgentService: RaWebAgentService,
    ) { }
}
