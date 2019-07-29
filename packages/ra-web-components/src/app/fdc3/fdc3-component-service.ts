import { Type } from "@angular/core";
import { FDC3Service } from "./fdc3.service";
import { LayoutService } from "../layout/layout.service";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";

export abstract class FDC3ComponentService {

    public fDC3Service: FDC3Service;
    public router: Router;
    public layoutService: LayoutService;
    public data: any;
    public token: any;
    public store: Store;

    public component: Type<any>;
    public injections: { [key: string]: any } = {};

    public abstract start(): Promise<any>;

    public setInjections(items: any[]) {
        for (const item of items) {
            this.setInjection(item);
        }
    }

    public setInjection(item: any) {
        const name = item.constructor.name === "Function" ? item.name : item.constructor.name;
        this.injections[name] = item;
    }

    public getInjection<T>(item: any): T {
        const name = item.constructor.name === "Function" ? item.name : item.constructor.name;
        return this.injections[name];
    }

}
