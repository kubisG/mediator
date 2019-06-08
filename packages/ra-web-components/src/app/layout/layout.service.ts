import { Injectable, Inject } from "@angular/core";
import { Store } from "@ngxs/store";
import { Router } from "@angular/router";
import { LogoutSuccess } from "@ra/web-core-fe";
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

    constructor(
        @Inject(GoldenLayoutStateStore) private stateStore: LayoutStateStorage,
        private dockableService: DockableService,
        private layoutMenuItemsService: LayoutMenuItemsService,
        public dialog: MatDialog,
    ) { }

    private newLayout() {
        const dialogRef = this.dialog.open(InputDialogComponent, {
            data: { text: "", ok: "Save" }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.layoutMenuItemsService.addLeftMenuItem({
                    label: result,
                    data: `savedLayout`
                });
                this.loadLayout(result);
            }
        });
    }

    private deleteLayout() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { text: "Are you sure to delete layout?" }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const layoutName = this.stateStore.getLayoutName();
                this.stateStore.deleteLayout(layoutName).then((data) => {
                    this.layoutMenuItemsService.removeFromLeftMenu({ label: layoutName });
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

    private addComponentToLayout(item: any) {
        const component = item.data;
        this.dockableService.addComponent({
            label: component.componentName,
            componentName: component.componentName,
            component: component.component,
            single: item.single
        });
    }

    public loadSavedLayoutsNames() {
        this.layoutMenuItemsService.addLeftMenuItem({
            divider: true,
            label: ""
        });
        this.stateStore.getLayoutsName().then((data) => {
            data.forEach((name) => {
                this.layoutMenuItemsService.addLeftMenuItem({
                    label: name,
                    data: `savedLayout`
                });
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
        if (item.label === `Delete Layout`) {
            this.deleteLayout();
            return;
        }
        if (item.label === `New Layout`) {
            this.newLayout();
            return;
        }
        this.itemAction.next(item);
    }

}
