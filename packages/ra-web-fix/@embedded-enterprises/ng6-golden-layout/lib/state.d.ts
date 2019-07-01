import { InjectionToken, Provider } from '@angular/core';
export declare const GoldenLayoutStateStore: InjectionToken<{}>;
export interface StateStore {
    writeState(state: any): void;
    loadState(): Promise<any>;
}
export declare const DEFAULT_LOCAL_STORAGE_STATE_STORE_KEY = "$ng-golden-layout-state";
export declare class LocalStorageStateStore implements StateStore {
    private readonly key;
    constructor(key: string);
    writeState(state: any): void;
    loadState(): Promise<any>;
}
export declare function DEFAULT_LOCAL_STORAGE_STATE_STORE_FACTORY(): LocalStorageStateStore;
export declare const DEFAULT_LOCAL_STORAGE_STATE_STORE: LocalStorageStateStore;
export declare const DEFAULT_LOCAL_STORAGE_STATE_STORE_PROVIDER: Provider;
