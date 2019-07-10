import { IntentMetadata } from "./intent-metadata.interface";
import { AppMetadata } from "./app-metadata.interface";

export interface AppIntent {
    intent: IntentMetadata;
    apps: Array<AppMetadata>;
}
