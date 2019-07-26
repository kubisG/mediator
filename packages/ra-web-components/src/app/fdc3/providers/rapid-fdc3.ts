import { FDC3Provider } from "./fdc3-provider.interface";
import { Context } from "../../ra-web-agent/interfaces/context.interface";

export class RapidFDC3 implements FDC3Provider {

    setAsRoot() {

    }

    hide() {

    }

    open(url: string, name: string, accessToken: string, initData?: any): Promise<any> {
        return Promise.resolve();
    }

    addListener(event: string, handler: (event: any) => void, win?: any) {

    }

    closeApp() {

    }

    broadcast(context: Context) {

    }

    addContextListener(handler: (context: Context) => void) {

    }

    getCustomData(): Promise<any> {
        return Promise.resolve();
    }

    findWindow(opts: any): Promise<any> {
        return Promise.resolve();
    }

    getWorkSpaceConfig(): Promise<any> {
        return Promise.resolve();
    }

    restoreWorkSpace(workSpace: any, token?: string): Promise<any> {
        return Promise.resolve();
    }

    sendNotification(id: string, title: string, msg: string, icon?: string) {

    }

}
