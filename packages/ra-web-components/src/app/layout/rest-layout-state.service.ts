import { Injectable, InjectionToken, Inject } from "@angular/core";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { Observable } from "rxjs/internal/Observable";
import { LayoutStateStorage } from "./layout-state-storage.interface";
import { RestLayoutService } from "@ra/web-shared-fe";

export const STORE_MODULE = new InjectionToken<string>("storeModule");

@Injectable()
export class RestLayoutStateService implements LayoutStateStorage {

    private activeLayoutSubject: ReplaySubject<string> = new ReplaySubject<string>(1);
    private activeLayoutSubject$: Observable<any> = this.activeLayoutSubject.asObservable();
    private defaultLayoutSubject: ReplaySubject<string> = new ReplaySubject<string>(1);
    private defaultLayoutSubject$: Observable<any> = this.defaultLayoutSubject.asObservable();
    private layoutName;
    private defaultLayoutName;
    private layoutState;

    constructor(
        private restLayoutService: RestLayoutService,
        @Inject(STORE_MODULE) private module: string,
    ) { 
        this.getDefaultLayout().then((data) => {
            if (data) {
                this.layoutName = data;
                this.defaultLayoutName = data;
            } else {
                this.layoutName = "default";
                this.defaultLayoutName = "default";
            }
            this.activeLayoutSubject.next(this.layoutName);
            this.defaultLayoutSubject.next(this.defaultLayoutName);
        });
    }

    setLayoutName(name: string) {
        this.layoutName = name;
        this.activeLayoutSubject.next(name);
    }

    getLayoutName() {
        return this.layoutName;
    }

    writeState(state: any): void {
        this.layoutState = state;
    }

    saveLayout(): Promise<any> {
        if (this.layoutState) {
            return this.restLayoutService.setLayout(this.layoutState, `${this.module}-${this.layoutName}`);
        } else {
            return Promise.reject();
        }
    }

    loadState(): Promise<any> {
        return this.restLayoutService.getLayout(`${this.module}-${this.layoutName}`).then((data) => {
            if (!data) {
                throw Error();
            }
            return data;
        });
    }

    getState(): Promise<any> {
        return this.restLayoutService.getLayout(`${this.module}-${this.layoutName}`);
    }

    deleteLayout(layoutName: string): Promise<any> {
        return this.restLayoutService.deleteLayout(`${this.module}-${layoutName}`).then(
            (data) => {
                return data;
            });
    }

    getDefaultLayout(): Promise<any> {
        return this.restLayoutService.getDefaultLayout(this.module).then((data) => {
            console.log(data);
            if (!data) {
                return this.defaultLayoutName;
            }
            return (data as any).value;
        });
    }

    setDefaultLayout(): Promise<any> {
        this.defaultLayoutName = this.layoutName;
        this.defaultLayoutSubject.next(this.layoutName);
        return this.restLayoutService.setDefaultLayout(this.module, this.layoutName).then((data) => {
            if (!data) {
                throw Error();
            }
            return data;
        });
    }

    getLayoutsName(): Promise<string[]> {
        return this.restLayoutService.getLayoutsName().then((data) => {
            const moduleLayouts = [];
            for (const layout of data) {
                let splited = [];
                try {
                    splited = layout.split(/\-(.+)/);
                } catch (ex) {
                    continue;
                }
                if (splited.length > 1 && splited[0] === this.module) {
                    moduleLayouts.push(splited[1]);
                }
            }
            if (moduleLayouts.length === 0) {
                moduleLayouts.push("default");
            }
            return moduleLayouts;
        });
    }

    activeLayout(): Observable<any> {
        return this.activeLayoutSubject$;
    }

    defaultLayout(): Observable<any> {
        return this.defaultLayoutSubject$;
    }
}
