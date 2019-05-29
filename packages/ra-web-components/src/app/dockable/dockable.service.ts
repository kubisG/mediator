import { Injectable, ElementRef } from "@angular/core";
import { ComponentsMapService } from "./components-map.service";
import { COMPONENT_ID } from "./constants";

@Injectable()
export class DockableService {

    constructor(
        private componentsMapService: ComponentsMapService,
    ) { }

    public stackBroadcast(msg: any, el: ElementRef) {
        const compId = el.nativeElement.getAttribute(COMPONENT_ID);
        this.componentsMapService.findOtherComponentsInStackAndEmitt(msg, compId);
    }

}
