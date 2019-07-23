import { Reflect } from "core-js";
import { ComponentFactoryResolver, Injector, Type, ApplicationRef, OnDestroy, ComponentRef, EventEmitter, ElementRef } from "@angular/core";
import { GlOnTab, GlOnShow, GlOnHide, GlOnClose, GoldenLayoutComponentState } from "@embedded-enterprises/ng6-golden-layout";
import * as GoldenLayout from "golden-layout";
import * as $ from "jquery";
import { DOCKABLE_CONFIG } from "./decorators/dockable.decorators";
import { DockableConfig } from "./decorators/dockable-config.interface";
import { ComponentsMapService } from "./components-map.service";
import { COMPONENT_ID } from "./constants";
import { Subscription } from "rxjs/internal/Subscription";
import { DockableService } from "./dockable.service";
import { FDC3ComponentService } from "../fdc3/fdc3-component-service";

export abstract class DockableComponent implements GlOnTab, GlOnShow, GlOnHide, GlOnClose, OnDestroy {

    protected dataSub: Subscription;
    protected clickSub: Subscription;
    protected isBind = true;
    protected isShown = false;

    public elementCid;
    public tab: GoldenLayout.Tab;
    public goldenLayout: GoldenLayout;
    private config: DockableConfig;
    private componentsMapService: ComponentsMapService;
    private attachedSubs = [];

    protected componentRefTab: ComponentRef<any>;
    protected componentRefHeader: ComponentRef<any>;

    public tabEmitter: EventEmitter<any> = new EventEmitter();
    public headerEmitter: EventEmitter<any> = new EventEmitter();
    public componentEmitter: EventEmitter<any> = new EventEmitter();
    protected elm: ElementRef;
    protected dockableService: DockableService;
    protected componentState: any;

    protected fDC3ComponentService: FDC3ComponentService;

    constructor(
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        this.componentsMapService = this.injector.get(ComponentsMapService);
        this.elm = this.injector.get(ElementRef);
        this.dockableService = this.injector.get(DockableService);
        try {
            this.goldenLayout = this.injector.get(GoldenLayout);
            this.dockableService.setLayoutManager(this.goldenLayout);
            this.componentState = this.injector.get(GoldenLayoutComponentState);
        } catch (ex) {
        }
        this.init();
    }

    private init() {
        this.config = Reflect.getMetadata(DOCKABLE_CONFIG, this.constructor);
        this.elementCid = this.componentsMapService.createKey();
        this.elm.nativeElement.setAttribute(COMPONENT_ID, this.elementCid);
        this.dockableService.addToSingleComponentsMap({
            label: this.config.label,
            componentName: this.config.label,
            component: this.constructor as Type<any>,
            single: this.config.single,
            closeable: this.config.closeable
        });
    }

    private createComponentRef(componentType: Type<any>) {
        const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
        const componentRef = factory.create(this.injector);
        this.applicationRef.attachView(componentRef.hostView);
        return componentRef;
    }

    private removeAllCompoChilds(elm: any) {
        const attr = COMPONENT_ID;
        const childs = elm.children();
        for (let i = 0; i < childs.length; i++) {
            const celm = $(childs[i]);
            if (celm.attr(attr)) {
                celm.remove();
            }
        }
    }

    private removeFromDOM() {
        if (this.tab) {
            this.removeAllCompoChilds(this.tab.element);
            this.removeAllCompoChilds(this.tab.header.controlsContainer);
        }
    }

    private clearComponents() {

        if (this.componentRefTab) {
            this.applicationRef.detachView(this.componentRefTab.hostView);
            this.componentRefTab.destroy();
        }
        if (this.componentRefHeader) {
            this.applicationRef.detachView(this.componentRefHeader.hostView);
            this.componentRefHeader.destroy();
        }
        this.removeFromDOM();
    }

    private getComponentRef(componentType: Type<any>, name: string) {
        const compo = this.componentsMapService.getComponent(this.elementCid, name);
        if (compo) {
            return compo;
        }
        const ref = this.createComponentRef(componentType);
        const refElm = ref.location.nativeElement;
        this.componentsMapService.addComponent(this, ref, this.elementCid, name);
        refElm.setAttribute(COMPONENT_ID, this.elementCid);
        return ref;
    }

    private attachEmitters(component: ComponentRef<any>, emitter: EventEmitter<any>) {
        if (component.instance.result) {
            const sub = component.instance.result.subscribe((data) => {
                emitter.emit(data);
            });
            this.attachedSubs.push(sub);
        }
    }

    private clearSubs() {
        for (let i = 0; i < this.attachedSubs.length; i++) {
            this.attachedSubs[i].unsubscribe();
        }
    }

    private appendHeader() {
        if (this.componentRefHeader) {
            const header = $(this.componentRefHeader.location.nativeElement);
            const li = $(document.createElement("LI"));
            li.attr(COMPONENT_ID, this.elementCid);
            li.append(header);
            (this.tab.header.controlsContainer as any).prepend(li);
        }
    }

    private appendTab() {
        if (this.componentRefTab) {
            (this.tab.element as any).prepend($(this.componentRefTab.location.nativeElement));
        }
    }

    protected setHeaderData(data: any) {
        if (this.componentRefHeader && this.componentRefHeader.instance.data) {
            this.componentRefHeader.instance.data = data;
            this.componentRefHeader.changeDetectorRef.markForCheck();
        }
    }

    protected setTabData(data: any) {
        if (this.componentRefTab && this.componentRefTab.instance.data) {
            this.componentRefTab.instance.data = data;
            this.componentRefTab.changeDetectorRef.markForCheck();
        }
    }

    protected getHeaderResult(): EventEmitter<any> {
        return this.headerEmitter;
    }

    protected getTabResult(): EventEmitter<any> {
        return this.tabEmitter;
    }

    public setFDC3ComponentService(fDC3ComponentService: FDC3ComponentService) {
        this.fDC3ComponentService = fDC3ComponentService;
    }

    public setComponentState(componentState: any) {
        console.log("componentState: ", componentState);
        this.componentState = componentState;
    }

    public initComponents() {
        this.removeFromDOM();
        this.clearSubs();
        if (this.config.tab) {
            this.componentRefTab = this.getComponentRef(this.config.tab.component, "tab");
            this.attachEmitters(this.componentRefTab, this.tabEmitter);
        }
        if (this.config.header) {
            this.componentRefHeader = this.getComponentRef(this.config.header.component, "header");
            this.attachEmitters(this.componentRefHeader, this.headerEmitter);
        }
    }

    public appendAll() {
        this.appendTab();
        this.appendHeader();
    }

    public glOnTab(tab: GoldenLayout.Tab): void {

        if ((this as any).dockableTab) {
            (this as any).dockableTab();
        }
        (tab.element as any).attr(COMPONENT_ID, this.elementCid);
        this.componentsMapService.setStack(tab.contentItem.parent);
        this.tab = tab;
        this.initComponents();
        this.appendAll();
    }

    public glOnShow(): void {

        this.isShown = true;
        if ((this as any).dockableShow) {
            (this as any).dockableShow();
        }
    }

    public glOnHide(): void {
        this.isShown = false;
        if ((this as any).dockableHide) {
            (this as any).dockableHide();
        }
    }

    public glOnClose(): Promise<void> {
        if (this.config.closeable === false) {
            return Promise.reject();
        }
        if ((this as any).dockableClose) {
            (this as any).dockableClose();
        }
        return Promise.resolve();
    }

    public ngOnDestroy() {

        if ((this as any).dockableClose) {
            (this as any).dockableClose();
        }
        this.componentsMapService.deleteComponents(this.elementCid);
        this.dockableService.removeComponent(this.constructor.name);
        this.clearComponents();
        this.unsubscribe();
    }


    public unsubscribe() {
        if (this.clickSub) {
            this.clickSub.unsubscribe();
        }
        if (this.dataSub) {
            this.dataSub.unsubscribe();
        }
    }

}
