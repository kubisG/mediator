import { Reflect } from "core-js";
import { ComponentFactoryResolver, Injector, Type, ApplicationRef, OnDestroy, ComponentRef } from "@angular/core";
import { GlOnTab } from '@embedded-enterprises/ng6-golden-layout';
import * as GoldenLayout from 'golden-layout';
import * as $ from "jquery";
import { DOCKABLE_CONFIG } from './decorators/dockable.decorators';
import { DockableConfig } from './decorators/dockable-config.interface';

export abstract class DockableComponent implements GlOnTab, OnDestroy {

    private tab: GoldenLayout.Tab;
    private initialized = false;
    private config: DockableConfig;

    protected componentFactoryResolver: ComponentFactoryResolver;
    protected injector: Injector;
    protected applicationRef: ApplicationRef;
    protected componentRefTab: ComponentRef<any>;
    protected componentRefHeader: ComponentRef<any>;

    constructor() { }

    private createComponentRef(componentType: Type<any>) {
        const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
        const componentRef = factory.create(this.injector);
        this.applicationRef.attachView(componentRef.hostView);
        return componentRef;
    }

    private initComponents() {
        if (this.initialized) {
            return;
        }
        this.config = Reflect.getMetadata(DOCKABLE_CONFIG, this.constructor);
        this.componentRefTab = this.createComponentRef(this.config.tab.component);
        this.componentRefHeader = this.createComponentRef(this.config.header.component);
        this.initialized = true;
    }

    private canAppend(): boolean {
        if (!this.config.header.single) {
            return true;
        }
        const controls: any = (this.tab.header.controlsContainer as any).get(0).childNodes;
        for (let i = 0; i < controls.length; i++) {
            const child = controls[i];
            const tagName = this.componentRefHeader.location.nativeElement.tagName;
            if (child.tagName === tagName) {
                return false;
            }
        }
        return true;
    }

    private appendHeader() {
        if (this.componentRefHeader && this.canAppend()) {
            (this.tab.header.controlsContainer as any).append($(this.componentRefHeader.location.nativeElement));
        }
    }

    private appendTab() {
        if (this.componentRefTab) {
            (this.tab.element as any).append($(this.componentRefTab.location.nativeElement));
        }
    }

    private appendAll() {
        this.appendTab();
        this.appendHeader();
    }

    public glOnTab(tab: GoldenLayout.Tab): void {
        this.tab = tab;
        this.initComponents();
        this.appendAll();
    }

    public ngOnDestroy() {
        this.applicationRef.detachView(this.componentRefTab.hostView);
        this.componentRefTab.destroy();
        this.applicationRef.detachView(this.componentRefHeader.hostView);
        this.componentRefHeader.destroy();
    }

}
