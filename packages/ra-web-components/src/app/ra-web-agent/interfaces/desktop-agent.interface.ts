import { Context } from "./context.interface";
import { AppIntent } from "./app-intent.interface";
import { IntentResolution } from "./intent-resolution.interface";
import { Listener } from "./listener.interface";

export interface DesktopAgent {

    open(name: string, context?: Context): Promise<void>;

    findIntent(intent: string, context?: Context): Promise<AppIntent>;

    findIntentsByContext(context: Context): Promise<Array<AppIntent>>;

    broadcast(context: Context): void;

    raiseIntent(intent: string, context: Context, target?: string): Promise<IntentResolution>;

    addIntentListener(intent: string, handler: (context: Context) => void): Listener;

    addContextListener(handler: (context: Context) => void): Listener;

}
