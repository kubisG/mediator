import { Injectable } from "@angular/core";
import { DesktopAgent } from "./interfaces/desktop-agent.interface";
import { Context } from "./interfaces/context.interface";
import { AppIntent } from "./interfaces/app-intent.interface";
import { IntentResolution } from "./interfaces/intent-resolution.interface";
import { Listener } from "./interfaces/listener.interface";
import { LayoutService } from "../layout/layout.service";
import { MenuItem } from "../header/menu-item.interface";
import { RestAppDirectoryService } from "./rest-app-directory.service";
import { AppDirectoryItemDto } from "@ra/web-shared/app-directory-item.dto";
import { RaManifest } from "./manifest/ra-manifest";
import { DockableService } from "../dockable/dockable.service";
import { AppHostComponent } from "./app-host/app-host.component";
@Injectable()
export class RaWebAgentService implements DesktopAgent {

    constructor(
        private layoutService: LayoutService,
        private restAppDirectoryService: RestAppDirectoryService,
        private dockableService: DockableService,
    ) { }

    public subscribeToItemActions() {
        this.layoutService.itemAction$.subscribe((item: MenuItem) => {
            if (item.data && item.data.appId) {
                this.open(item.data.appId, item.data.context);
            }
        });
    }

    async open(name: string, context?: Context): Promise<void> {
        const appDef: AppDirectoryItemDto = await this.restAppDirectoryService.getAppDef(name);
        const manifestData = await this.restAppDirectoryService.callGet(appDef.manifest);
        const manifest = new RaManifest(manifestData);
        this.dockableService.addComponent({
            label: manifest.getName(),
            componentName: "ra-app-host",
            component: AppHostComponent,
            state: {
                manifest,
                context
            }
        });
    }

    findIntent(intent: string, context?: Context): Promise<AppIntent> {
        return Promise.resolve(undefined);
    }

    findIntentsByContext(context: Context): Promise<AppIntent[]> {
        return Promise.resolve(undefined);
    }

    broadcast(context: Context): void {

    }

    raiseIntent(intent: string, context: Context, target?: string): Promise<IntentResolution> {
        return Promise.resolve(undefined);
    }

    addIntentListener(intent: string, handler: (context: Context) => void): Listener {
        return;
    }

    addContextListener(handler: (context: Context) => void): Listener {
        return;
    }

}
