import { Reflect } from "core-js";
import { Injectable, ElementRef, Type } from "@angular/core";
import { GoldenLayoutService } from "@embedded-enterprises/ng6-golden-layout";
import { ComponentsMapService } from "./components-map.service";
import { COMPONENT_ID } from "./constants";
import { DockableComponentConfig } from "./dockable-component-config.interface";
import { DOCKABLE_CONFIG } from "./decorators/dockable.decorators";
import { DockableConfig } from "./decorators/dockable-config.interface";

@Injectable()
export class DockableService {

    private singleComponentsMap: { [key: string]: DockableComponentConfig } = {};

    constructor(
        private componentsMapService: ComponentsMapService,
        private goldenLayoutService: GoldenLayoutService,
    ) { }

    public stackBroadcast(msg: any, el: ElementRef) {
        const compId = el.nativeElement.getAttribute(COMPONENT_ID);
        this.componentsMapService.findOtherComponentsInStackAndEmitt(msg, compId);
    }

    public addComponent(config: DockableComponentConfig) {
        if (config.single && this.singleComponentsMap[config.component.name]) {
            return;
        } else if (config.single && !this.singleComponentsMap[config.component.name]) {
            this.singleComponentsMap[config.component.name] = config;
        }
        this.goldenLayoutService.createNewComponent({
            componentName: config.componentName,
            component: config.component
        }, config.label, config.state );
    }

    public getComponentConfig(component: Type<any>): DockableConfig {
        return Reflect.getMetadata(DOCKABLE_CONFIG, component);
    }

}
