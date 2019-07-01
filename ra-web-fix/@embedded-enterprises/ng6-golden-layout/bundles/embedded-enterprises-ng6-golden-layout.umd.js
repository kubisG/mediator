(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('golden-layout'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define('@embedded-enterprises/ng6-golden-layout', ['exports', '@angular/core', 'golden-layout', '@angular/common'], factory) :
	(factory((global['embedded-enterprises'] = global['embedded-enterprises'] || {}, global['embedded-enterprises']['ng6-golden-layout'] = {}),global.ng.core,global.GoldenLayout,global.ng.common));
}(this, (function (exports,core,GoldenLayout,common) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.
See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */









function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}
function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var GoldenLayoutConfiguration = new core.InjectionToken('GoldenLayoutConfiguration');
var GoldenLayoutStateStore = new core.InjectionToken('GoldenLayoutStateStore');
var DEFAULT_LOCAL_STORAGE_STATE_STORE_KEY = '$ng-golden-layout-state';
var LocalStorageStateStore = /** @class */ (function () {
    function LocalStorageStateStore(key) {
        this.key = key;
    }
    LocalStorageStateStore.prototype.writeState = function (state) {
        localStorage.setItem(this.key, JSON.stringify(state));
    };
    LocalStorageStateStore.prototype.loadState = function () {
        var state = localStorage.getItem(this.key);
        return state
            ? Promise.resolve(JSON.parse(state))
            : Promise.reject("No state found using key: " + this.key);
    };
    return LocalStorageStateStore;
}());
function DEFAULT_LOCAL_STORAGE_STATE_STORE_FACTORY() {
    return new LocalStorageStateStore(DEFAULT_LOCAL_STORAGE_STATE_STORE_KEY);
}
var DEFAULT_LOCAL_STORAGE_STATE_STORE = new LocalStorageStateStore(DEFAULT_LOCAL_STORAGE_STATE_STORE_KEY);
var DEFAULT_LOCAL_STORAGE_STATE_STORE_PROVIDER = {
    provide: GoldenLayoutStateStore,
    useFactory: DEFAULT_LOCAL_STORAGE_STATE_STORE_FACTORY
};
var GoldenLayoutService = /** @class */ (function () {
    function GoldenLayoutService(config, stateStore) {
        this.config = config;
        this.stateStore = stateStore;
        this._layout = null;
    }
    GoldenLayoutService.prototype.initialize = function (goldenLayout, componentInitCallbackFactory) {
        var _this = this;
        this._layout = goldenLayout;
        this.config.components.forEach(function (componentConfig) {
            var componentInitCallback = componentInitCallbackFactory.createComponentInitCallback(componentConfig.component);
            goldenLayout.registerComponent(componentConfig.componentName, componentInitCallback);
        });
        if (this.stateStore) {
            ((((goldenLayout)))).on('stateChanged', function () {
                _this._saveState(goldenLayout);
            });
        }
    };
    GoldenLayoutService.prototype._saveState = function (goldenLayout) {
        if (this.stateStore && goldenLayout.isInitialised) {
            try {
                this.stateStore.writeState(goldenLayout.toConfig());
            }
            catch (ex) {
            }
        }
    };
    GoldenLayoutService.prototype.getState = function () {
        var _this = this;
        if (this.stateStore) {
            return this.stateStore.loadState().catch(function () {
                return _this.config.defaultLayout;
            });
        }
        return Promise.resolve(this.config.defaultLayout);
    };
    GoldenLayoutService.prototype.getRegisteredComponents = function () {
        return this.config.components;
    };
    GoldenLayoutService.prototype.createNewComponent = function (comp, title, state) {
        var content = (this._layout.createContentItem({
            type: 'component',
            componentName: comp.componentName,
            componentState: state,
            title: title,
        }));
        var root = this._layout.root;
        var element = null;
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
    };
    GoldenLayoutService.prototype.findStack = function (contentItems) {
        if (!contentItems) {
            return null;
        }
        try {
            for (var contentItems_1 = __values(contentItems), contentItems_1_1 = contentItems_1.next(); !contentItems_1_1.done; contentItems_1_1 = contentItems_1.next()) {
                var x = contentItems_1_1.value;
                if (x.type === 'stack') {
                    return x;
                }
                var s = this.findStack(x.contentItems);
                if (s !== null) {
                    return s;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (contentItems_1_1 && !contentItems_1_1.done && (_a = contentItems_1.return)) _a.call(contentItems_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _a;
    };
    GoldenLayoutService.prototype.isChildWindow = function () {
        return !!window.opener;
    };
    GoldenLayoutService.prototype.getRootWindow = function () {
        return window.opener || window;
    };
    return GoldenLayoutService;
}());
GoldenLayoutService.decorators = [
    { type: core.Injectable },
];
GoldenLayoutService.ctorParameters = function () { return [
    { type: GoldenLayoutConfiguration, decorators: [{ type: core.Inject, args: [GoldenLayoutConfiguration,] }] },
    { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [GoldenLayoutStateStore,] }] }
]; };
var FallbackComponent = new core.InjectionToken("fallback component");
var FailedComponent = new core.InjectionToken("failed component");
var GoldenLayoutContainer = new core.InjectionToken('GoldenLayoutContainer');
var GoldenLayoutComponentState = new core.InjectionToken('GoldenLayoutComponentState');
function implementsGlOnResize(obj) {
    return typeof obj === 'object' && typeof obj.glOnResize === 'function';
}
function implementsGlOnShow(obj) {
    return typeof obj === 'object' && typeof obj.glOnShow === 'function';
}
function implementsGlOnHide(obj) {
    return typeof obj === 'object' && typeof obj.glOnHide === 'function';
}
function implementsGlOnTab(obj) {
    return typeof obj === 'object' && typeof obj.glOnTab === 'function';
}
function implementsGlOnClose(obj) {
    return typeof obj === 'object' && typeof obj.glOnClose === 'function';
}
var Deferred = /** @class */ (function () {
    function Deferred() {
        var _this = this;
        this.promise = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
    }
    return Deferred;
}());
var GoldenLayoutComponent = /** @class */ (function () {
    function GoldenLayoutComponent(glService, viewContainer, appref, componentFactoryResolver, ngZone, injector, fallbackComponent) {
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
            ((console)).__log = console.log;
            console.log = this.topWindow.console.log;
        }
        if (core.isDevMode())
            console.log("Create@" + (this.isChildWindow ? 'child' : 'root') + "!");
    }
    GoldenLayoutComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (core.isDevMode())
            console.log("Init@" + (this.isChildWindow ? 'child' : 'root') + "!");
        var anyWin = (this.topWindow);
        if (!this.isChildWindow) {
            anyWin.__apprefs = [];
            anyWin.__injector = this.injector;
        }
        anyWin.__apprefs.push(this.appref);
        ((this.appref)).__tick = this.appref.tick;
        this.appref.tick = function () {
            var _loop_1 = function (ar) {
                ar._zone.run(function () { return ar.__tick(); });
            };
            try {
                for (var _a = __values(((_this.topWindow)).__apprefs), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var ar = _b.value;
                    _loop_1(ar);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_2) throw e_2.error; }
            }
            var e_2, _c;
        };
        this.glService.getState().then(function (layout) {
            _this._createLayout(layout);
        });
    };
    GoldenLayoutComponent.prototype.ngOnDestroy = function () {
        if (core.isDevMode())
            console.log("Destroy@" + (this.isChildWindow ? 'child' : 'root') + "!");
        if (this.isChildWindow) {
            console.log = ((console)).__log;
        }
        this.unloaded = true;
        this.appref.tick = ((this.appref)).__tick;
    };
    GoldenLayoutComponent.prototype.unloadHandler = function () {
        if (core.isDevMode())
            console.log("Unload@" + (this.isChildWindow ? 'child' : 'root'));
        if (this.unloaded) {
            return;
        }
        this.onUnloaded.resolve();
        this.unloaded = true;
        if (this.isChildWindow) {
            var index = ((this.topWindow)).__apprefs.indexOf(this.appref);
            ((this.topWindow)).__apprefs.splice(index, 1);
        }
    };
    GoldenLayoutComponent.prototype._createLayout = function (layout) {
        var _this = this;
        this.goldenLayout = new GoldenLayout(layout, $(this.el.nativeElement));
        this.goldenLayout.getComponent = function (type) {
            var component = ((_this.goldenLayout))._components[type] || _this.fallbackType;
            if (!component) {
                throw new Error("Unknown component \"" + type + "\"");
            }
            return component;
        };
        this.glService.initialize(this.goldenLayout, this);
        this.goldenLayout.init();
    };
    GoldenLayoutComponent.prototype.onResize = function (event) {
        if (this.goldenLayout) {
            this.goldenLayout.updateSize();
        }
    };
    GoldenLayoutComponent.prototype.createComponentInitCallback = function (componentType) {
        var self = this;
        return function (container, componentState) {
            self.ngZone.run(function () {
                var factory = self.componentFactoryResolver.resolveComponentFactory(componentType);
                var failedComponent = null;
                if (componentType === self.fallbackComponent) {
                    failedComponent = ((container))._config.componentName;
                }
                var injector = self._createComponentInjector(container, componentState, failedComponent);
                var componentRef = self.viewContainer.createComponent(factory, undefined, injector);
                container.getElement().append($(componentRef.location.nativeElement));
                self._bindEventHooks(container, componentRef.instance);
                var destroyed = false;
                container.on('destroy', function () {
                    if (destroyed) {
                        return;
                    }
                    destroyed = true;
                    $(componentRef.location.nativeElement).remove();
                    componentRef.destroy();
                });
                self.onUnloaded.promise.then(function () {
                    if (destroyed) {
                        return;
                    }
                    destroyed = true;
                    $(componentRef.location.nativeElement).remove();
                    componentRef.destroy();
                });
            });
        };
    };
    GoldenLayoutComponent.prototype._createComponentInjector = function (container, componentState, failed) {
        var providers = [
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
        return core.Injector.create(providers, this.injector);
    };
    GoldenLayoutComponent.prototype._bindEventHooks = function (container, component) {
        if (implementsGlOnResize(component)) {
            container.on('resize', function () {
                component.glOnResize();
            });
        }
        if (implementsGlOnShow(component)) {
            container.on('show', function () {
                component.glOnShow();
            });
        }
        if (implementsGlOnHide(component)) {
            container.on('hide', function () {
                component.glOnHide();
            });
        }
        if (implementsGlOnTab(component)) {
            container.on('tab', function (tab) {
                component.glOnTab(tab);
            });
        }
        if (implementsGlOnClose(component)) {
            var hookEstablished_1 = false;
            container.on('tab', function (tab) {
                if (hookEstablished_1) {
                    return;
                }
                hookEstablished_1 = true;
                tab.closeElement.off('click');
                var originalClose = tab._onCloseClick.bind(tab);
                tab._onCloseClick = function (ev) {
                    ev.stopPropagation();
                    tab.contentItem.container.close();
                };
                tab._onCloseClickFn = tab._onCloseClick.bind(tab);
                tab.closeElement.click(tab._onCloseClickFn);
            });
            var containerClose_1 = container.close.bind(container);
            container.close = function () {
                console.log("Container close:", container);
                if (!((container))._config.isClosable) {
                    return false;
                }
                component.glOnClose().then(function () {
                    containerClose_1();
                }, function () {
                });
            };
        }
    };
    return GoldenLayoutComponent;
}());
GoldenLayoutComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'golden-layout-root',
                styles: ["\n    .ng-golden-layout-root {\n      width:100%;\n      height:100%;\n    }"
                ],
                template: "<div class=\"ng-golden-layout-root\" #glroot></div>"
            },] },
];
GoldenLayoutComponent.ctorParameters = function () { return [
    { type: GoldenLayoutService },
    { type: core.ViewContainerRef },
    { type: core.ApplicationRef },
    { type: core.ComponentFactoryResolver },
    { type: core.NgZone },
    { type: core.Injector },
    { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [FallbackComponent,] }] }
]; };
GoldenLayoutComponent.propDecorators = {
    el: [{ type: core.ViewChild, args: ['glroot',] }],
    unloadHandler: [{ type: core.HostListener, args: ['window:beforeunload',] }],
    onResize: [{ type: core.HostListener, args: ['window:resize', ['$event'],] }]
};
var GoldenLayoutModule = /** @class */ (function () {
    function GoldenLayoutModule() {
    }
    GoldenLayoutModule.forRoot = function (config) {
        return {
            ngModule: GoldenLayoutModule,
            providers: [
                GoldenLayoutService,
                { provide: GoldenLayoutConfiguration, useValue: config }
            ]
        };
    };
    return GoldenLayoutModule;
}());
GoldenLayoutModule.decorators = [
    { type: core.NgModule, args: [{
                declarations: [GoldenLayoutComponent],
                exports: [GoldenLayoutComponent],
                imports: [common.CommonModule]
            },] },
];
function MultiWindowInit() {
    if (!window.opener) {
        ((window)).__services = new ((window)).Map();
        ((window)).__serviceConstructors = new ((window)).Map();
    }
}
function MultiWindowService() {
    return function (constructor) {
        var constr = (constructor);
        var rootWindow = ((window.opener || window));
        var newConstructor = ((function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var hasInstance = rootWindow.__services.has(constr.name);
            if (!hasInstance) {
                var storedConstr = rootWindow.__serviceConstructors.get(constr.name) || constr;
                rootWindow.__services.set(constr.name, new (storedConstr.bind.apply(storedConstr, __spread([void 0], args)))());
            }
            return rootWindow.__services.get(constr.name);
        }));
        if (window === rootWindow) {
            var metadata = ((Reflect)).getMetadata('design:paramtypes', constr);
            ((Reflect)).metadata('design:paramtypes', metadata)(newConstructor);
        }
        return (newConstructor);
    };
}

exports.GoldenLayoutConfiguration = GoldenLayoutConfiguration;
exports.GoldenLayoutContainer = GoldenLayoutContainer;
exports.GoldenLayoutComponentState = GoldenLayoutComponentState;
exports.GoldenLayoutComponent = GoldenLayoutComponent;
exports.GoldenLayoutService = GoldenLayoutService;
exports.GoldenLayoutModule = GoldenLayoutModule;
exports.GoldenLayoutStateStore = GoldenLayoutStateStore;
exports.DEFAULT_LOCAL_STORAGE_STATE_STORE_KEY = DEFAULT_LOCAL_STORAGE_STATE_STORE_KEY;
exports.LocalStorageStateStore = LocalStorageStateStore;
exports.DEFAULT_LOCAL_STORAGE_STATE_STORE_FACTORY = DEFAULT_LOCAL_STORAGE_STATE_STORE_FACTORY;
exports.DEFAULT_LOCAL_STORAGE_STATE_STORE = DEFAULT_LOCAL_STORAGE_STATE_STORE;
exports.DEFAULT_LOCAL_STORAGE_STATE_STORE_PROVIDER = DEFAULT_LOCAL_STORAGE_STATE_STORE_PROVIDER;
exports.MultiWindowInit = MultiWindowInit;
exports.MultiWindowService = MultiWindowService;
exports.FallbackComponent = FallbackComponent;
exports.FailedComponent = FailedComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=embedded-enterprises-ng6-golden-layout.umd.js.map
