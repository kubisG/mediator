import { Injectable } from "@angular/core";
import { FDC3Provider } from "./fdc3-provider.interface";
import { OpenFin } from "./openfin";
import { Context } from "../../ra-web-agent/interfaces/context.interface";
import { RapidFDC3 } from "./rapid-fdc3";

@Injectable()
export class FDC3ProvidersFactoryService implements FDC3Provider {

    private provider: FDC3Provider;

    constructor() {
        this.init();
    }

    private init() {
        if ((window as any)[`fin`]) {
            this.provider = new OpenFin();
        } else {
            this.provider = new RapidFDC3();
        }
    }

    hide() {
        return this.provider.hide();
    }

    open(url: string, name: string, accessToken: string, initData?: any): Promise<any> {
        return this.provider.open(url, name, accessToken, initData);
    }

    addListener(event: string, handler: (event) => void, win?: any) {
        return this.provider.addListener(event, handler, win);
    }

    closeApp() {
        return this.provider.closeApp();
    }

    broadcast(context: Context) {
        return this.provider.broadcast(context);
    }

    addContextListener(handler: (context: Context) => void) {
        return this.provider.addContextListener(handler);
    }

    setAsRoot() {
        return this.provider.setAsRoot();
    }

    getCustomData() {
        return this.provider.getCustomData();
    }

    findWindow(opts: any): Promise<any> {
        return this.provider.findWindow(opts);
    }

    getWorkSpaceConfig(): Promise<any> {
        return this.provider.getWorkSpaceConfig();
    }

    restoreWorkSpace(workSpace: any, token?: string): Promise<any> {
        return this.provider.restoreWorkSpace(workSpace, token);
    }

    sendNotification(id: string, title: string, msg: string, icon?: string) {
        return this.provider.sendNotification(id, msg, title, icon)
    }

}
