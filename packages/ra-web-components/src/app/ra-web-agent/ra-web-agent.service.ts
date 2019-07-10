import { Injectable } from "@angular/core";
import { DesktopAgent } from "./interfaces/desktop-agent.interface";
import { Context } from "./interfaces/context.interface";
import { AppIntent } from "./interfaces/app-intent.interface";
import { IntentResolution } from "./interfaces/intent-resolution.interface";
import { Listener } from "./interfaces/listener.interface";

@Injectable()
export class RaWebAgentService implements DesktopAgent {

    open(name: string, context?: Context): Promise<void> {
        return Promise.resolve();
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
