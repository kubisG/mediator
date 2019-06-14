import { Injectable, ComponentRef } from "@angular/core";
import { DockableComponent } from "./dockable.component";
import * as GoldenLayout from "golden-layout";
import { COMPONENT_ID } from "./constants";

@Injectable({
    providedIn: "root"
})
export class ComponentsMapService {

    private itr = 1;
    public map: { [key: string]: { [key: string]: any } } = {};

    private stackItr = 1;
    public stacks: { [key: string]: GoldenLayout.ContentItem } = {};

    constructor() { }

    private addStack(key: string, stack: GoldenLayout.ContentItem) {
        this.stacks[key] = stack;
        this.stacks[key].on("activeContentItemChanged", (item) => {
            const mapItem = this.map[item.tab.element.attr(COMPONENT_ID)];
            if (!mapItem) {
                return;
            }
            const component: DockableComponent = mapItem.instance;
            component.initComponents();
            component.appendAll();
        });
    }

    private findStackByComponentCid(cid: string) {
        for (const key in this.stacks) {
            if (this.stacks[key]) {
                const stack = this.stacks[key];
                for (const contentItem of stack.contentItems) {
                    if (cid === (contentItem.element as any).children().children().attr(COMPONENT_ID)) {
                        return stack;
                    }
                }
            }
        }
    }

    public findOtherComponentsInStackAndEmitt(data: any, cid: string) {
        const stack = this.findStackByComponentCid(cid);
        for (const contentItem of stack.contentItems) {
            const key = (contentItem.element as any).children().children().attr(COMPONENT_ID);
            this.map[key].instance.componentEmitter.emit(data);
        }
    }

    public setStack(stack: GoldenLayout.ContentItem) {
        if (!(stack.element as any).attr(COMPONENT_ID)) {
            const key = `comp_${this.stackItr}`;
            (stack.element as any).attr(COMPONENT_ID, `comp_${this.stackItr}`);
            this.stackItr++;
            this.addStack(key, stack);
        }
    }

    public createKey() {
        const key = `comp_${this.itr}`;
        this.itr++;
        return key;
    }

    public addComponent(instance: DockableComponent, compo: ComponentRef<any>, key: string, name: string) {
        if (this.map[key]) {
            this.map[key][name] = compo;
        } else {
            this.map[key] = {};
            this.map[key][name] = compo;
        }
        this.map[key]["instance"] = instance;
    }

    public getComponent(key: string, name: string): ComponentRef<any> {
        if (!this.map[key]) {
            return;
        }
        return this.map[key][name];
    }

    public deleteAll() {
        for (const key of Object.keys(this.map)) {
            if (this.map[key]) {
                this.map[key].instance.ngOnDestroy();
                this.deleteComponents(key);
            }
        }
        this.map = {};
        this.stacks = {};
        this.itr = 0;
        this.stackItr = 0;
    }

    public deleteComponents(key: string) {
        if (this.map[key]) {
            delete this.map[key];
        }
    }

    public getDockableLayouts() {
        const instances = [];
        for (const key in this.map) {
            if (this.map[key]) {
                instances.push(this.map[key]["instance"]);
            }
        }
        return instances;
    }

}
