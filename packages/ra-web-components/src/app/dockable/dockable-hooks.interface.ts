export interface DockableHooks {

    dockableClose(): Promise<void>;

    dockableShow();

    dockableTab();

    dockableHide();

}
