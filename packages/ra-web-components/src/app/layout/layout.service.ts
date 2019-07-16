import { Injectable, Inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { InputDialogComponent, ConfirmDialogComponent } from "@ra/web-shared-fe";
import { GoldenLayoutStateStore } from "@embedded-enterprises/ng6-golden-layout";
import { LayoutStateStorage } from "./layout-state-storage.interface";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { LayoutMenuItemsService } from "./layout-menu-items.service";
import { DockableService } from "../dockable/dockable.service";
import { MenuItem } from "../header/menu-item.interface";

@Injectable()
export class LayoutService {

    private layoutReload: Subject<boolean> = new Subject<boolean>();
    public layoutReload$: Observable<any> = this.layoutReload.asObservable();

    private itemAction: Subject<any> = new Subject<any>();
    public itemAction$: Observable<any> = this.itemAction.asObservable();

    private messages: Subject<any> = new Subject<any>();
    public messages$: Observable<any> = this.messages.asObservable();

    constructor(
        @Inject(GoldenLayoutStateStore) private stateStore: LayoutStateStorage,
        private dockableService: DockableService,
        private layoutMenuItemsService: LayoutMenuItemsService,
        public dialog: MatDialog,
    ) { }

    private newLayout() {
        const dialogRef = this.dialog.open(InputDialogComponent, {
            data: { text: "", ok: "Save", header: "Save layout" }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                if (result !== "default") {
                    this.layoutMenuItemsService.addLeftMenuItem({
                        label: result,
                        data: `savedLayout`
                    });
                    this.stateStore.setLayoutName(result);
                    this.saveLayout();
                } else {
                    this.cantCreate();
                }
            }
        });
    }

    private cantCreate() {
    }

    private deleteLayout() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: "Are you sure to delete layout?" }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const layoutName = this.stateStore.getLayoutName();
                this.stateStore.deleteLayout(layoutName).then((data) => {
                    if (layoutName !== "default") {
                        this.layoutMenuItemsService.removeFromLeftMenu({ label: layoutName });
                    }
                    this.loadLayout("default");
                });
            }
        });
    }

    private loadLayout(name: string) {
        this.stateStore.setLayoutName(name);
        this.layoutReload.next(false);
        this.dockableService.removeAll();
        setTimeout((instance) => {
            instance.layoutReload.next(true);
        }, 100, this);
    }

    private saveLayout() {
        this.stateStore.saveLayout().then((data) => {
        });
    }

<<<<<<< HEAD
    public addComponentToLayout(item: any) {
=======
    private setDefaultLayout() {
        this.stateStore.setDefaultLayout().then((data) => {
        });
    }

    private addComponentToLayout(item: any) {
>>>>>>> 217645da2bfbe31e843b57e8da2f9b101b339303
        const component = item.data;
        this.dockableService.addComponent({
            label: component.componentName,
            componentName: component.componentName,
            component: component.component,
            single: item.single,
            closeable: item.closeable,
            state: component.state
        });
    }

    public loadSavedLayoutsNames() {
        this.layoutMenuItemsService.clearLeftMenuItems();
        this.layoutMenuItemsService.addLeftMenuItem({
            divider: true,
            label: ""
        });
        this.stateStore.getLayoutsName().then((data) => {
            data.forEach((layout) => {

                if (typeof layout === "string") {
                    this.layoutMenuItemsService.addLeftMenuItem({
                        label: layout,
                        data: `savedLayout`,
                        default: false
                    });
                } else {
                    this.layoutMenuItemsService.addLeftMenuItem({
                        label: (layout as any).name,
                        data: `savedLayout`,
                        default: (layout as any).default
                    });
                }
            });
        });
    }

    public doMenuItemAction(item: MenuItem) {
        if (item.data && item.data.componentName) {
            this.addComponentToLayout(item);
            return;
        }
        if (item.data && item.data === `savedLayout`) {
            this.loadLayout(item.label);
            return;
        }
        if (item.label === `Set as default Layout`) {
            this.setDefaultLayout();
            return;
        }
        if (item.label === `Update Layout`) {
            this.saveLayout();
            return;
        }
        if (item.label === `Delete Layout`) {
            this.deleteLayout();
            return;
        }
        if (item.label === `Save new Layout`) {
            this.newLayout();
            return;
        }
        this.itemAction.next(item);
    }

    public removeAll() {
        this.dockableService.removeAll();
    }
}
