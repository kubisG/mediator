import { Injectable, ComponentRef } from "@angular/core";
import { DockableComponent } from './dockable.component';
import * as GoldenLayout from 'golden-layout';

@Injectable({
    providedIn: "root"
})
export class ComponentsMapService {

    private elemetCidAttr = "cId";

    private itr = 1;
    public map: { [key: string]: { [key: string]: any } } = {};

    private stackItr = 1;
    public stacks: { [key: string]: any } = {};

    constructor() { }

    public setStack(stack: GoldenLayout.ContentItem) {
        if (!(stack.element as any).attr(this.elemetCidAttr)) {
            const key = `comp_${this.stackItr}`;
            (stack.element as any).attr(this.elemetCidAttr, `comp_${this.stackItr}`)
            this.stackItr++;
            this.stacks[key] = stack;
            this.stacks[key].on("activeContentItemChanged", (item) => {
                const mapItem = this.map[item.tab.element.attr(this.elemetCidAttr)];
                if (!mapItem) {
                    return;
                }
                const component: DockableComponent = mapItem.instance;
                component.initComponents();
                component.appendAll();
            });
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

    public deleteComponents(key: string) {
        delete this.map[key];
    }

    public getDockableLayouts() {
        const instances = [];
        for (let key in this.map) {
            instances.push(this.map[key]["instance"]);
        }
        return instances;
    }

}
