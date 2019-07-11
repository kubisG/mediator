import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "@ra/web-material-fe";
import { DockableModule } from "../dockable/dockable.module";
import { NotifyComponent } from "./notify.component";
import { NotifyListService } from "./notify-list.service";
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule, PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        DockableModule,
        PerfectScrollbarModule,
    ],
    declarations: [
        NotifyComponent,
    ],
    exports: [
        NotifyComponent,
    ],
    entryComponents: [
        NotifyComponent,
    ],
    providers: [
        NotifyListService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
    ]
})
export class NotifyModule {
}
