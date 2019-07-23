import { Context } from "../../ra-web-agent/interfaces/context.interface";

export interface FDC3Provider {

    setAsRoot();

    hide();

    open(url: string, name: string, accessToken: string, initData?: any): Promise<any>;

    addListener(event: string, handler: (event) => void, win?: any);

    closeApp();

    broadcast(context: Context);

    addContextListener(handler: (context: Context) => void): any;

    getCustomData(): Promise<any>;

    findWindow(opts: any): Promise<any>;

    getWorkSpaceConfig(): Promise<any>;

    restoreWorkSpace(workSpace: any, token?: string): Promise<any>;

}
