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

    public addToSingleComponentsMap(config: DockableComponentConfig): boolean {
        if (config.single && this.singleComponentsMap[config.component.name]) {
            return false;
        } else if (config.single && !this.singleComponentsMap[config.component.name]) {
            this.singleComponentsMap[config.component.name] = config;
            return true;
        }
        return true;
    }

    public addComponent(config: DockableComponentConfig) {
        if (!this.addToSingleComponentsMap(config)) {
            return;
        }
        const componentConfig = this.getComponentConfig(config.component);
        this.goldenLayoutService.createNewComponent({
            componentName: config.componentName,
            component: config.component
        }, config.state && config.state.label ? config.state.label : componentConfig.label, config.state);
    }

    public removeAll() {
        this.componentsMapService.deleteAll();
        this.singleComponentsMap = {};
    }

    public removeComponent(name: string) {
        delete this.singleComponentsMap[name];
    }

    public getComponentConfig(component: Type<any>): DockableConfig {
        return Reflect.getMetadata(DOCKABLE_CONFIG, component);
    }

}
