import { StateStore } from "@embedded-enterprises/ng6-golden-layout";
import { Observable } from "rxjs/internal/Observable";

export interface LayoutStateStorage extends StateStore {

    setLayoutName(name: string);

    getLayoutName();

    writeState(state: any): void;

    loadState(): Promise<any>;

    deleteLayout(layoutName: string): Promise<any>;

    getLayoutsName(): Promise<string[]>;

    activeLayout(): Observable<any>;

    defaultLayout(): Observable<any>;

    saveLayout(): Promise<any>;

    getDefaultLayout(): Promise<any>;

    setDefaultLayout(): Promise<any>;

}
