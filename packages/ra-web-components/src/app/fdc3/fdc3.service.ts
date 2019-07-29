import { Injectable, Type, Inject } from "@angular/core";
import { Store } from "@ngxs/store";
import { FDC3ProvidersFactoryService } from "./providers/fdc3-providers-factory.service";
import { Context } from "../ra-web-agent/interfaces/context.interface";
import { LayoutStateStorage } from "../layout/layout-state-storage.interface";
import { GoldenLayoutStateStore } from "@embedded-enterprises/ng6-golden-layout";

@Injectable()
export class FDC3Service {

    private root = false;

    public injections: any[] = [];

    constructor(
        private store: Store,
        private fDC3ProvidersFactoryService: FDC3ProvidersFactoryService,
        @Inject(GoldenLayoutStateStore) private layoutStateStorage: LayoutStateStorage,
    ) { }

    async open(appId: string, name: string, data?: any) {
        const token = this.store.snapshot().auth.accessToken;
        const path = `/fdc3/${appId}?data=${encodeURIComponent(JSON.stringify(data))}&token=${encodeURIComponent(token)}`;
        return this.fDC3ProvidersFactoryService.open(path, name, token, data).then((result) => {
            return this.loadWorkspace().then((data) => {
                return result;
            });
        });
    }

    hide() {
        this.fDC3ProvidersFactoryService.hide();
    }

    addListener(event: string, handler: (event) => void, win?: any) {
        this.fDC3ProvidersFactoryService.addListener(event, handler, win);
    }

    closeApp() {
        return this.fDC3ProvidersFactoryService.closeApp();
    }

    broadcast(context: Context) {
        return this.fDC3ProvidersFactoryService.broadcast(context);
    }

    addContextListener(handler: (context: Context) => void) {
        return this.fDC3ProvidersFactoryService.addContextListener(handler);
    }

    setAsRoot() {
        this.root = true;
        this.fDC3ProvidersFactoryService.setAsRoot();
    }

    isRoot() {
        return this.root;
    }

    getCustomData() {
        return this.fDC3ProvidersFactoryService.getCustomData();
    }

    getWorkSpaceConfig(): Promise<any> {
        return this.fDC3ProvidersFactoryService.getWorkSpaceConfig();
    }

    getSavedWorkSpace(): Promise<any> {
        this.layoutStateStorage.setLayoutName("openfin");
        return this.layoutStateStorage.getState();
    }

    loadWorkspace() {
        return this.fDC3ProvidersFactoryService.getWorkSpaceConfig().then((layout) => {
            return this.layoutStateStorage.writeState(layout);
        });
    }

    saveLayout() {
        return this.fDC3ProvidersFactoryService.getWorkSpaceConfig().then((layout) => {
            this.layoutStateStorage.writeState(layout);
            this.layoutStateStorage.setLayoutName("openfin");
            return this.layoutStateStorage.saveLayout();
        });
    }

    restoreWorkSpace(workSpace: any) {
        const token = this.store.snapshot().auth.accessToken;
        return this.fDC3ProvidersFactoryService.restoreWorkSpace(workSpace, token);
    }

    sendNotification(id: string, title: string, msg: string, icon?: string) {
        return this.fDC3ProvidersFactoryService.sendNotification(id, title, msg, icon);
    }

}
