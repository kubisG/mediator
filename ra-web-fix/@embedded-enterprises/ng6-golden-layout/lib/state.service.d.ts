import { InjectionToken } from '@angular/core';
import { IComponentStateStore } from './state';
export declare const ComponentState: InjectionToken<{}>;
export declare class ComponentStateService<T> {
    private readonly componentId;
    private readonly stateStore;
    constructor(componentId: string, stateStore: IComponentStateStore<T>);
    getState(): Promise<T>;
    saveState(state: T): Promise<void>;
    deleteState(): void;
}
