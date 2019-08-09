import { RestUsersService } from "../rest/rest-users.service";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { LayoutStateStorage } from "@ra/web-components";

export class RaLayoutStateStorage implements LayoutStateStorage {

    private activeLayoutSubject: Subject<any> = new Subject<any>();
    private activeLayoutSubject$: Observable<any> = this.activeLayoutSubject.asObservable();

    private layoutName = "default";
    private lastState: any;

    constructor(
        private restUsersService: RestUsersService,
    ) { }

    setLayoutName(name: string) {
        this.layoutName = name;
        this.activeLayoutSubject.next(name);
    }

    getLayoutName() {
        return this.layoutName;
    }

    deleteLayout(layoutName: string): Promise<any> {
        return this.restUsersService.deleteLayout(layoutName);
    }

    getLayoutsName(): Promise<string[]> {
        return this.restUsersService.getLayoutsName();
    }

    activeLayout(): Observable<any> {
        return this.activeLayoutSubject$;
    }

    public writeState(state: any): void {
        this.lastState = state;
        this.restUsersService.setLayout(state, this.layoutName);
    }

    public loadState(): Promise<any> {
        return this.restUsersService.getLayout(this.layoutName).then((data) => {
            if (!data) {
                throw Error();
            }
            return data;
        });
    }

    public getState(): Promise<any> {
        return this.restUsersService.getLayout(`${this.module}-${this.layoutName}`);
    }

}
