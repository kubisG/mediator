import { Injectable, ComponentRef } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class ComponentsMapService {

    constructor() {

    }

    private itr = 1;
    public map: { [key: string]: ComponentRef<any> } = {};

    public addComponent(compo: ComponentRef<any>): string {
        const key = `key_${this.itr}`;
        this.map[key] = compo;
        this.itr++;
        return key;
    }

    public getComponent(key: string): ComponentRef<any> {
        return this.map[key];
    }

}
