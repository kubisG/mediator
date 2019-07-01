import { ComponentFactoryResolver, ViewContainerRef, OnInit, OnDestroy, ApplicationRef, Type, NgZone, InjectionToken, Injector } from '@angular/core';
import { GoldenLayoutService, ComponentInitCallbackFactory, ComponentInitCallback } from './golden-layout.service';
export declare const GoldenLayoutContainer: InjectionToken<{}>;
export declare const GoldenLayoutComponentState: InjectionToken<{}>;
export declare class GoldenLayoutComponent implements OnInit, OnDestroy, ComponentInitCallbackFactory {
    private glService;
    private viewContainer;
    private appref;
    private componentFactoryResolver;
    private ngZone;
    private readonly injector;
    private readonly fallbackComponent;
    private goldenLayout;
    private topWindow;
    private isChildWindow;
    private unloaded;
    private onUnloaded;
    private fallbackType;
    private el;
    constructor(glService: GoldenLayoutService, viewContainer: ViewContainerRef, appref: ApplicationRef, componentFactoryResolver: ComponentFactoryResolver, ngZone: NgZone, injector: Injector, fallbackComponent: any);
    ngOnInit(): void;
    ngOnDestroy(): void;
    unloadHandler(): void;
    private _createLayout(layout);
    onResize(event: any): void;
    createComponentInitCallback(componentType: Type<any>): ComponentInitCallback;
    /**
     * Creates an injector capable of injecting the GoldenLayout object,
     * component container, and initial component state.
     */
    private _createComponentInjector(container, componentState, failed);
    /**
     * Registers an event handler for each implemented hook.
     * @param container Golden Layout component container.
     * @param component Angular component instance.
     */
    private _bindEventHooks(container, component);
}
