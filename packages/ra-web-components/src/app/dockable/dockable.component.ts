import { Reflect } from "core-js";
import { ComponentFactoryResolver, Injector, Type, ApplicationRef, OnDestroy, ComponentRef, EventEmitter } from "@angular/core";
import { GlOnTab, GlOnShow, GlOnHide } from '@embedded-enterprises/ng6-golden-layout';
import * as GoldenLayout from 'golden-layout';
import * as $ from "jquery";
import { DOCKABLE_CONFIG } from './decorators/dockable.decorators';
import { DockableConfig } from './decorators/dockable-config.interface';
import { ComponentsMapService } from './components-map.service';

export abstract class DockableComponent implements GlOnTab, GlOnShow, OnDestroy {

    private elemetCid = "cId";
    private tab: GoldenLayout.Tab;
    private config: DockableConfig;
    private componentsMapService: ComponentsMapService;
    private attachedSubs = [];

    protected componentRefTab: ComponentRef<any>;
    protected componentRefHeader: ComponentRef<any>;

    protected tabEmitter: EventEmitter<any> = new EventEmitter();
    protected headerEmitter: EventEmitter<any> = new EventEmitter();

    constructor(
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected injector: Injector,
        protected applicationRef: ApplicationRef,
    ) {
        this.componentsMapService = this.injector.get(ComponentsMapService);
    }

    private createComponentRef(componentType: Type<any>) {
        const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
        const componentRef = factory.create(this.injector);
        this.applicationRef.attachView(componentRef.hostView);
        return componentRef;
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
    }

    private getComponentSelector(componentType: Type<any>) {
        return (componentType as any).__annotations__[0].selector.toUpperCase();
    }

    private getComponentRef(componentType: Type<any>) {
        const elm = this.findExists(this.getComponentSelector(componentType));
        if (!elm) {
            const ref = this.createComponentRef(componentType);
            const refElm = ref.location.nativeElement;
            refElm.setAttribute(this.elemetCid, this.componentsMapService.addComponent(ref));
            return ref;
        }
        return this.componentsMapService.getComponent(elm.getAttribute(this.elemetCid));
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

    private initComponents() {
        this.clearSubs();
        this.config = Reflect.getMetadata(DOCKABLE_CONFIG, this.constructor);
        if (this.config.tab) {
            this.componentRefTab = this.createComponentRef(this.config.tab.component);
            this.attachEmitters(this.componentRefTab, this.tabEmitter);
        }
        if (this.config.header) {
            this.componentRefHeader = this.getComponentRef(this.config.header.component);
            this.attachEmitters(this.componentRefHeader, this.headerEmitter);
        }
    }

    private findExists(tagName?: string): any {
        tagName = tagName ? tagName : this.componentRefHeader.location.nativeElement.tagName;
        if (!this.config.header.single) {
            return;
        }
        const controls: any = (this.tab.header.controlsContainer as any).get(0).childNodes;
        for (let i = 0; i < controls.length; i++) {
            const child = controls[i];
            if (child.childNodes.length > 0 && child.childNodes[0].tagName === tagName) {
                return child.childNodes[0];
            }
        }
        return;
    }

    private appendHeader() {
        if (this.componentRefHeader) {
            const header = $(this.componentRefHeader.location.nativeElement);
            const elm = this.findExists(this.getComponentSelector(this.config.header.component));
            if (!elm) {
                const li = $(`<li class="ra-custom-header"></li>`);
                li.append(header);
                (this.tab.header.controlsContainer as any).prepend(li);
            }
        }
    }

    private appendTab() {
        if (this.componentRefTab) {
            (this.tab.element as any).prepend($(this.componentRefTab.location.nativeElement));
        }
    }

    private appendAll() {
        this.appendTab();
        this.appendHeader();
    }

    protected setHeaderData(data: any) {
        if (this.componentRefHeader.instance.data) {
            this.componentRefHeader.instance.data = data;
            this.componentRefHeader.changeDetectorRef.markForCheck();
        }
    }

    protected setTabData(data: any) {
        if (this.componentRefTab.instance.data) {
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

    public glOnTab(tab: GoldenLayout.Tab): void {
        this.tab = tab;
        this.initComponents();
        this.appendAll();
    }

    public glOnShow(): void {
        const controls: any = (this.tab.header.controlsContainer as any).get(0).childNodes;
        for (let i = 0; i < controls.length; i++) {
            const child = controls[i];
            if (child.className === "ra-custom-header") {
                child.remove();
            }
        }
        this.appendHeader();
    }

    public ngOnDestroy() {
        this.clearComponents();
    }

}
