import { FDC3Provider } from "./fdc3-provider.interface";

export class OpenFin implements FDC3Provider {

    private fin = (window as any).fin;

    hide(win?: any) {
        const finWindow = win ? win : this.fin.desktop.Window.getCurrent();
        finWindow.hide();
    }

    open(options: {
        name: string,
        url: string,
        customRequestHeaders: {
            headers: { [key: string]: any }[],
        }[]
    }): Promise<any> {
        return this.fin.Window.create(options);
    }

}
