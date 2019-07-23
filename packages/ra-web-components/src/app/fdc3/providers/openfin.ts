import { FDC3Provider } from "./fdc3-provider.interface";
import { Context } from "../../ra-web-agent/interfaces/context.interface";
import { workspaces } from 'openfin-layouts';
import { Workspace } from 'openfin-layouts/dist/client/workspaces';
import * as _ from "lodash";
export class OpenFin implements FDC3Provider {

    private handlers: ((context: Context) => void)[] = [];
    private fin = (window as any).fin;

    constructor() {
        this.init();
    }

    private init() {
        this.fin.InterApplicationBus.subscribe({ uuid: "*" }, "contextTopic", (msg) => {
            for (const handler of this.handlers) {
                handler(msg);
            }
        });
    }

    private getWindow() {
        return this.fin.Window.getCurrent();
    }

    hide(win?: any) {
        const finWindow = win ? win : this.fin.desktop.Window.getCurrent();
        finWindow.hide();
    }

    async addListener(event: string, handler: (event) => void, win?: any) {
        win = win ? win : await this.fin.Window.getCurrent();
        return win.addListener(event, handler);
    }

    getCustomData(): Promise<any> {
        return this.fin.Window.getCurrent()
            .then((win) => {
                return win.getOptions().then((opts) => {
                    return opts.customData ? opts.customData : {};
                });
            });
    }

    async findWindow(opts: { uuid: string, name: string }): Promise<any> {
        return await this.fin.Window.wrap(opts);
    }

    async open(
        url: string, name: string, accessToken: string, initData?: any
    ): Promise<any> {
        const opts = {
            name,
            url,
            customData: initData,
        };
        return this.fin.Window.create(opts);
    }

    async closeApp() {
        const app = await this.fin.Application.getCurrent();
        app.quit(true);
    }

    async broadcast(context: Context) {
        await this.fin.InterApplicationBus.publish("contextTopic", context);
    }

    async addContextListener(handler: (context: Context) => void) {
        this.handlers.push(handler);
    }

    async setAsRoot() {
        const win = await this.getWindow();
        win.on("closing", (event) => {
            this.closeApp();
        });
        win.on("close-requested", (event) => {
            this.closeApp();
        });
        win.on("closed", (event) => {

        });
    }

    async getWorkSpaceConfig() {
        const workspaceObject: Workspace = await workspaces.generate();
        return workspaceObject;
    }

    async restoreWorkSpace(workSpace: any, token?: string) {
        const createPromises = [];
        const groups: { [key: string]: any } = {};
        for (const app of workSpace.apps) {
            for (const win of app.childWindows) {
                groups[`${win.uuid};;;${win.name}`] = win.windowGroup;
                const prosime = this.fin.Window.create(win);
                createPromises.push(prosime);
            }
        }
        Promise.all(createPromises).then(async () => {
            for (const key of Object.keys(groups)) {
                const splited = key.split(";;;");
                const wraped = await this.fin.Window.wrap({ uuid: splited[0], name: splited[1] });
                for (const winId of groups[key]) {
                    const wrapedForJoin = await this.fin.Window.wrap(winId);
                    const result = await wrapedForJoin.joinGroup(wraped);
                }
            }
        });
    }

}
