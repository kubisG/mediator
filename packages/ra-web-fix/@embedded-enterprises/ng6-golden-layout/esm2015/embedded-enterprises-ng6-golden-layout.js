import { InjectionToken, Inject, Injectable, Optional, isDevMode, ComponentFactoryResolver, HostListener, ViewContainerRef, Component, ApplicationRef, NgZone, Injector, ViewChild, NgModule } from '@angular/core';
import * as GoldenLayout from 'golden-layout';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @record
 */

/** @type {?} */
const GoldenLayoutConfiguration = new InjectionToken('GoldenLayoutConfiguration');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const GoldenLayoutStateStore = new InjectionToken('GoldenLayoutStateStore');
/**
 * @record
 */

/** @type {?} */
const DEFAULT_LOCAL_STORAGE_STATE_STORE_KEY = '$ng-golden-layout-state';
class LocalStorageStateStore {
    /**
     * @param {?} key
     */
    constructor(key) {
        this.key = key;
    }
    /**
     * @param {?} state
     * @return {?}
     */
    writeState(state) {
        localStorage.setItem(this.key, JSON.stringify(state));
    }
    /**
     * @return {?}
     */
    loadState() {
        /** @type {?} */
        const state = localStorage.getItem(this.key);
        return state
            ? Promise.resolve(JSON.parse(state))
            : Promise.reject(`No state found using key: ${this.key}`);
    }
}
/**
 * @return {?}
 */
function DEFAULT_LOCAL_STORAGE_STATE_STORE_FACTORY() {
    return new LocalStorageStateStore(DEFAULT_LOCAL_STORAGE_STATE_STORE_KEY);
}
/** @type {?} */
const DEFAULT_LOCAL_STORAGE_STATE_STORE = new LocalStorageStateStore(DEFAULT_LOCAL_STORAGE_STATE_STORE_KEY);
/** @type {?} */
const DEFAULT_LOCAL_STORAGE_STATE_STORE_PROVIDER = {
    provide: GoldenLayoutStateStore,
    useFactory: DEFAULT_LOCAL_STORAGE_STATE_STORE_FACTORY
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * golden-layout component initialization callback type.
 * @record
 */

/**
 * @record
 */

class GoldenLayoutService {
    /**
     * @param {?} config
     * @param {?} stateStore
     */
    constructor(config, stateStore) {
        this.config = config;
        this.stateStore = stateStore;
        this._layout = null;
    }
    /**
     * @param {?} goldenLayout
     * @param {?} componentInitCallbackFactory
     * @return {?}
     */
    initialize(goldenLayout, componentInitCallbackFactory) {
        this._layout = goldenLayout;
        this.config.components.forEach((componentConfig) => {
            /** @type {?} */
            const componentInitCallback = componentInitCallbackFactory.createComponentInitCallback(componentConfig.component);
            goldenLayout.registerComponent(componentConfig.componentName, componentInitCallback);
        });
        if (this.stateStore) {
            (/** @type {?} */ ((/** @type {?} */ (goldenLayout)))).on('stateChanged', () => {
                this._saveState(goldenLayout);
            });
        }
    }
    /**
     * @param {?} goldenLayout
     * @return {?}
     */
    _saveState(goldenLayout) {
        if (this.stateStore && goldenLayout.isInitialised) {
            try {
                this.stateStore.writeState(goldenLayout.toConfig());
            }
            catch (ex) {
                // Workaround for https://github.com/deepstreamIO/golden-layout/issues/192
            }
        }
    }
    /**
     * @return {?}
     */
    getState() {
        if (this.stateStore) {
            return this.stateStore.loadState().catch(() => {
                return this.config.defaultLayout;
            });
        }
        return Promise.resolve(this.config.defaultLayout);
    }
    /**
     * @return {?}
     */
    getRegisteredComponents() {
        return this.config.components;
    }
    /**
     * @param {?} comp
     * @param {?=} title
     * @param {?=} state
     * @return {?}
     */
    createNewComponent(comp, title, state) {
        /** @type {?} */
        const content = /** @type {?} */ (this._layout.createContentItem({
            type: 'component',
            componentName: comp.componentName,
            componentState: state,
            title: title,
        }));
        /** @type {?} */
        const root = this._layout.root;
        /** @type {?} */
        let element = null;
        if (!root.contentItems || root.contentItems.length === 0) {
            element = root;
        }
        else {
            element = this.findStack(root.contentItems);
        }
        if (element === null) {
            throw new Error("this should never happen!");
        }
        element.addChild(content);
    }
    /**
     * @param {?} contentItems
     * @return {?}
     */
    findStack(contentItems) {
        if (!contentItems) {
            return null;
        }
        for (const x of contentItems) {
            if (x.type === 'stack') {
                return x;
            }
            /** @type {?} */
            const s = this.findStack(x.contentItems);
            if (s !== null) {
                return s;
            }
        }
    }
    /**
     * @return {?}
     */
    isChildWindow() {
        return !!window.opener;
    }
    /**
     * @return {?}
     */
    getRootWindow() {
        return window.opener || window;
    }
}
GoldenLayoutService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
GoldenLayoutService.ctorParameters = () => [
    { type: GoldenLayoutConfiguration, decorators: [{ type: Inject, args: [GoldenLayoutConfiguration,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [GoldenLayoutStateStore,] }] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const FallbackComponent = new InjectionToken("fallback component");
/** @type {?} */
const FailedComponent = new InjectionToken("failed component");

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const GoldenLayoutContainer = new InjectionToken('GoldenLayoutContainer');
/** @type {?} */
const GoldenLayoutComponentState = new InjectionToken('GoldenLayoutComponentState');
/**
 * Type guard which determines if a component implements the GlOnResize interface.
 * @param {?} obj
 * @return {?}
 */
function implementsGlOnResize(obj) {
    return typeof obj === 'object' && typeof obj.glOnResize === 'function';
}
/**
 * Type guard which determines if a component implements the GlOnShow interface.
 * @param {?} obj
 * @return {?}
 */
function implementsGlOnShow(obj) {
    return typeof obj === 'object' && typeof obj.glOnShow === 'function';
}
/**
 * Type guard which determines if a component implements the GlOnHide interface.
 * @param {?} obj
 * @return {?}
 */
function implementsGlOnHide(obj) {
    return typeof obj === 'object' && typeof obj.glOnHide === 'function';
}
/**
 * Type guard which determines if a component implements the GlOnTab interface.
 * @param {?} obj
 * @return {?}
 */
function implementsGlOnTab(obj) {
    return typeof obj === 'object' && typeof obj.glOnTab === 'function';
}
/**
 * Type guard which determines if a component implements the GlOnClose interface.
 * @param {?} obj
 * @return {?}
 */
function implementsGlOnClose(obj) {
    return typeof obj === 'object' && typeof obj.glOnClose === 'function';
}
/**
 * @template T
 */
class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
class GoldenLayoutComponent {
    /**
     * @param {?} glService
     * @param {?} viewContainer
     * @param {?} appref
     * @param {?} componentFactoryResolver
     * @param {?} ngZone
     * @param {?} injector
     * @param {?} fallbackComponent
     */
    constructor(glService, viewContainer, appref, componentFactoryResolver, ngZone, injector, fallbackComponent) {
        this.glService = glService;
        this.viewContainer = viewContainer;
        this.appref = appref;
        this.componentFactoryResolver = componentFactoryResolver;
        this.ngZone = ngZone;
        this.injector = injector;
        this.fallbackComponent = fallbackComponent;
        this.unloaded = false;
        this.onUnloaded = new Deferred();
        this.fallbackType = null;
        this.topWindow = glService.getRootWindow();
        this.isChildWindow = glService.isChildWindow();
        if (!!fallbackComponent) {
            this.fallbackType = this.createComponentInitCallback(fallbackComponent);
        }
        if (this.isChildWindow) {
            window.document.title = window.document.URL;
            (/** @type {?} */ (console)).__log = console.log;
            console.log = this.topWindow.console.log;
        }
        if (isDevMode())
            console.log(`Create@${this.isChildWindow ? 'child' : 'root'}!`);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (isDevMode())
            console.log(`Init@${this.isChildWindow ? 'child' : 'root'}!`);
        /** @type {?} */
        let anyWin = /** @type {?} */ (this.topWindow);
        if (!this.isChildWindow) {
            anyWin.__apprefs = [];
            anyWin.__injector = this.injector;
        }
        // attach the application reference to the root window, save the original 'tick' method
        anyWin.__apprefs.push(this.appref);
        (/** @type {?} */ (this.appref)).__tick = this.appref.tick;
        this.appref.tick = () => {
            for (const ar of (/** @type {?} */ (this.topWindow)).__apprefs) {
                ar._zone.run(() => ar.__tick());
            }
        };
        this.glService.getState().then((layout) => {
            this._createLayout(layout);
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (isDevMode())
            console.log(`Destroy@${this.isChildWindow ? 'child' : 'root'}!`);
        if (this.isChildWindow) {
            console.log = (/** @type {?} */ (console)).__log;
        }
        this.unloaded = true;
        // restore the original tick method.
        // this appens in two cases:
        // either the window is closed, after that it's not important to restore the tick method
        // or within the root window, where we HAVE to restore the original tick method
        this.appref.tick = (/** @type {?} */ (this.appref)).__tick;
    }
    /**
     * @return {?}
     */
    unloadHandler() {
        if (isDevMode())
            console.log(`Unload@${this.isChildWindow ? 'child' : 'root'}`);
        if (this.unloaded) {
            return;
        }
        this.onUnloaded.resolve();
        this.unloaded = true;
        if (this.isChildWindow) {
            /** @type {?} */
            const index = (/** @type {?} */ (this.topWindow)).__apprefs.indexOf(this.appref);
            (/** @type {?} */ (this.topWindow)).__apprefs.splice(index, 1);
        }
    }
    /**
     * @param {?} layout
     * @return {?}
     */
    _createLayout(layout) {
        this.goldenLayout = new GoldenLayout(layout, $(this.el.nativeElement));
        this.goldenLayout.getComponent = (type) => {
            /** @type {?} */
            const component = (/** @type {?} */ (this.goldenLayout))._components[type] || this.fallbackType;
            if (!component) {
                throw new Error(`Unknown component "${type}"`);
            }
            return component;
        };
        // Register all golden-layout components.
        this.glService.initialize(this.goldenLayout, this);
        // Initialize the layout.
        this.goldenLayout.init();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onResize(event) {
        if (this.goldenLayout) {
            this.goldenLayout.updateSize();
        }
    }
    /**
     * @param {?} componentType
     * @return {?}
     */
    createComponentInitCallback(componentType) {
        /** @type {?} */
        const self = this;
        return function (container, componentState) {
            self.ngZone.run(() => {
                /** @type {?} */
                const factory = self.componentFactoryResolver.resolveComponentFactory(componentType);
                /** @type {?} */
                let failedComponent = null;
                if (componentType === self.fallbackComponent) {
                    // Failed to find the component constructor **AND** we have a fallback component defined,
                    // so lookup the failed component's name and inject it into the fallback component.
                    failedComponent = (/** @type {?} */ (container))._config.componentName;
                }
                /** @type {?} */
                const injector = self._createComponentInjector(container, componentState, failedComponent);
                /** @type {?} */
                const componentRef = self.viewContainer.createComponent(factory, undefined, injector);
                // Bind the new component to container's client DOM element.
                container.getElement().append($(componentRef.location.nativeElement));
                self._bindEventHooks(container, componentRef.instance);
                /** @type {?} */
                let destroyed = false;
                container.on('destroy', () => {
                    if (destroyed) {
                        return;
                    }
                    destroyed = true;
                    $(componentRef.location.nativeElement).remove();
                    componentRef.destroy();
                });
                self.onUnloaded.promise.then(() => {
                    if (destroyed) {
                        return;
                    }
                    destroyed = true;
                    $(componentRef.location.nativeElement).remove();
                    componentRef.destroy();
                });
            });
        };
    }
    /**
     * Creates an injector capable of injecting the GoldenLayout object,
     * component container, and initial component state.
     * @param {?} container
     * @param {?} componentState
     * @param {?} failed
     * @return {?}
     */
    _createComponentInjector(container, componentState, failed) {
        /** @type {?} */
        const providers = [
            {
                provide: GoldenLayoutContainer,
                useValue: container
            },
            {
                provide: GoldenLayoutComponentState,
                useValue: componentState
            },
            {
                provide: GoldenLayout,
                useValue: this.goldenLayout
            },
        ];
        if (!!failed) {
            providers.push({
                provide: FailedComponent,
                useValue: failed,
            });
        }
        return Injector.create(providers, this.injector);
    }
    /**
     * Registers an event handler for each implemented hook.
     * @param {?} container Golden Layout component container.
     * @param {?} component Angular component instance.
     * @return {?}
     */
    _bindEventHooks(container, component) {
        if (implementsGlOnResize(component)) {
            container.on('resize', () => {
                component.glOnResize();
            });
        }
        if (implementsGlOnShow(component)) {
            container.on('show', () => {
                component.glOnShow();
            });
        }
        if (implementsGlOnHide(component)) {
            container.on('hide', () => {
                component.glOnHide();
            });
        }
        if (implementsGlOnTab(component)) {
            container.on('tab', (tab) => {
                component.glOnTab(tab);
            });
        }
        if (implementsGlOnClose(component)) {
            /** @type {?} */
            let hookEstablished = false;
            container.on('tab', (tab) => {
                /* GoldenLayout SHOULD send a tabEvent when the component is placed within a tab control, giving
                           us access to the tab object, which allows us to patch the close handler to actually call the
                           right close option.
                        */
                if (hookEstablished) {
                    return;
                }
                hookEstablished = true;
                tab.closeElement.off('click');
                /** @type {?} */
                const originalClose = tab._onCloseClick.bind(tab);
                tab._onCloseClick = (ev) => {
                    ev.stopPropagation();
                    tab.contentItem.container.close();
                };
                tab._onCloseClickFn = tab._onCloseClick.bind(tab);
                tab.closeElement.click(tab._onCloseClickFn);
            });
            /** @type {?} */
            const containerClose = container.close.bind(container);
            container.close = () => {
                console.log("Container close:", container);
                if (!(/** @type {?} */ (container))._config.isClosable) {
                    return false;
                }
                component.glOnClose().then(() => {
                    containerClose();
                }, () => {
                    /* Prevent close, don't care about rejections */
                });
            };
        }
    }
}
GoldenLayoutComponent.decorators = [
    { type: Component, args: [{
                selector: 'golden-layout-root',
                styles: [`
    .ng-golden-layout-root {
      width:100%;
      height:100%;
    }`
                ],
                template: `<div class="ng-golden-layout-root" #glroot></div>`
            },] },
];
/** @nocollapse */
GoldenLayoutComponent.ctorParameters = () => [
    { type: GoldenLayoutService },
    { type: ViewContainerRef },
    { type: ApplicationRef },
    { type: ComponentFactoryResolver },
    { type: NgZone },
    { type: Injector },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [FallbackComponent,] }] }
];
GoldenLayoutComponent.propDecorators = {
    el: [{ type: ViewChild, args: ['glroot',] }],
    unloadHandler: [{ type: HostListener, args: ['window:beforeunload',] }],
    onResize: [{ type: HostListener, args: ['window:resize', ['$event'],] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class GoldenLayoutModule {
    /**
     * @param {?} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: GoldenLayoutModule,
            providers: [
                GoldenLayoutService,
                { provide: GoldenLayoutConfiguration, useValue: config }
            ]
        };
    }
}
GoldenLayoutModule.decorators = [
    { type: NgModule, args: [{
                declarations: [GoldenLayoutComponent],
                exports: [GoldenLayoutComponent],
                imports: [CommonModule]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @return {?}
 */
function MultiWindowInit() {
    if (!window.opener) {
        (/** @type {?} */ (window)).__services = new (/** @type {?} */ (window)).Map();
        (/** @type {?} */ (window)).__serviceConstructors = new (/** @type {?} */ (window)).Map();
    }
}
/**
 * @template T
 * @return {?}
 */
function MultiWindowService() {
    return function (constructor) {
        /** @type {?} */
        const constr = /** @type {?} */ (constructor);
        /** @type {?} */
        const rootWindow = /** @type {?} */ ((window.opener || window));
        /** @type {?} */
        const newConstructor = /** @type {?} */ ((function (...args) {
            /** @type {?} */
            const hasInstance = rootWindow.__services.has(constr.name);
            if (!hasInstance) {
                /** @type {?} */
                const storedConstr = rootWindow.__serviceConstructors.get(constr.name) || constr;
                rootWindow.__services.set(constr.name, new storedConstr(...args));
            }
            return rootWindow.__services.get(constr.name);
        }));
        if (window === rootWindow) {
            /** @type {?} */
            const metadata = (/** @type {?} */ (Reflect)).getMetadata('design:paramtypes', constr);
            (/** @type {?} */ (Reflect)).metadata('design:paramtypes', metadata)(newConstructor);
        }
        return /** @type {?} */ (newConstructor);
    };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { GoldenLayoutConfiguration, GoldenLayoutContainer, GoldenLayoutComponentState, GoldenLayoutComponent, GoldenLayoutService, GoldenLayoutModule, GoldenLayoutStateStore, DEFAULT_LOCAL_STORAGE_STATE_STORE_KEY, LocalStorageStateStore, DEFAULT_LOCAL_STORAGE_STATE_STORE_FACTORY, DEFAULT_LOCAL_STORAGE_STATE_STORE, DEFAULT_LOCAL_STORAGE_STATE_STORE_PROVIDER, MultiWindowInit, MultiWindowService, FallbackComponent, FailedComponent };
//# sourceMappingURL=embedded-enterprises-ng6-golden-layout.js.map
