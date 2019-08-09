import { RestUsersService } from "../../rest/rest-users.service";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { Observable } from "rxjs/internal/Observable";
import { LayoutStateStorage } from "@ra/web-components";

export class AdminLayoutStateStorage implements LayoutStateStorage {

    private activeLayoutSubject: ReplaySubject<string> = new ReplaySubject<string>(1);
    private activeLayoutSubject$: Observable<any> = this.activeLayoutSubject.asObservable();
    private defaultLayoutSubject: ReplaySubject<string> = new ReplaySubject<string>(1);
    private defaultLayoutSubject$: Observable<any> = this.defaultLayoutSubject.asObservable();

    private layoutName;
    private defaultLayoutName;
    private layoutState;
    private module = "adm";

    constructor(
        private restUsersService: RestUsersService,
    ) {
        this.layoutName = "default";
        this.defaultLayoutName = "default";
        this.activeLayoutSubject.next(this.layoutName);
        this.defaultLayoutSubject.next(this.defaultLayoutName);
    }

    setLayoutName(name: string) {
        this.layoutName = name;
        this.activeLayoutSubject.next(name);
    }

    getLayoutName() {
        return this.layoutName;
    }

    deleteLayout(layoutName: string): Promise<any> {
        return this.restUsersService.deleteLayout(`${this.module}-${layoutName}`).then(
            (data) => {
                return data;
            });
    }

    getLayoutsName(): Promise<string[]> {
        return this.restUsersService.getLayoutsName();
    }

    activeLayout(): Observable<any> {
        return this.activeLayoutSubject$;
    }

    writeState(state: any): void {
        this.layoutState = state;
    }

    saveLayout(): Promise<any> {
        return Promise.resolve();
        if (this.layoutState) {
            return this.restUsersService.setLayout(this.layoutState, `${this.module}-${this.layoutName}`);
        } else {
            return Promise.reject();
        }
    }

    loadState(): Promise<any> {
        //        return Promise.reject(`No state found using layoutName: ${this.module}-${this.layoutName}`);
        return Promise.reject();
        return this.restUsersService.getLayout(`${this.module}-${this.layoutName}`).then((data) => {
            if (!data) {
                throw Error();
            }
            return data;
        });
    }

    getState(): Promise<any> {
        return this.restUsersService.getLayout(`${this.module}-${this.layoutName}`);
    }

    setDefaultLayout(): Promise<any> {
        this.defaultLayoutName = this.layoutName;
        this.defaultLayoutSubject.next(this.layoutName);
        return Promise.resolve({});
    }

    getDefaultLayout(): Promise<any> {
        return Promise.resolve({ name: this.defaultLayoutName });
    }


    defaultLayout(): Observable<any> {
        console.log("default layot");
        return this.defaultLayoutSubject$;
    }

}
