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
    private layoutName = "default";

    constructor(
        private restLayoutService: RestLayoutService,
        @Inject(STORE_MODULE) private module: string,
    ) { }

    setLayoutName(name: string) {
        this.layoutName = name;
    }

    getLayoutName() {
        return this.layoutName;
    }

    writeState(state: any): void {
        this.restLayoutService.setLayout(state, `${this.module}-${this.layoutName}`);
    }

    loadState(): Promise<any> {
        return this.restLayoutService.getLayout(`${this.module}-${this.layoutName}`).then((data) => {
            if (!data) {
                throw Error();
            }
            return data;
        });
    }

    deleteLayout(layoutName: string): Promise<any> {
        return this.restLayoutService.deleteLayout(`${this.module}-${layoutName}`).then(
            (data) => {
                return data;
            });
    }

    getLayoutsName(): Promise<string[]> {
        return this.restLayoutService.getLayoutsName().then((data) => {
            const moduleLayouts = [];
            for (const layout of data) {
                let splited = [];
                try {
                    splited = layout.split("-");
                } catch (ex) {
                    continue;
                }
                if (splited.length === 2 && splited[0] === this.module) {
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

}
