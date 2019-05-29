import { NgModule } from "@angular/core";
import { ComponentsMapService } from "./components-map.service";
import { DockableService } from "./dockable.service";

@NgModule({
    providers: [
        ComponentsMapService,
        DockableService,
    ]
})
export class DockableModule {

}
