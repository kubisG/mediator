import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { MultiWindowService } from "@embedded-enterprises/ng6-golden-layout";

@MultiWindowService<DataExchangeService>()
@Injectable()
export class DataExchangeService {

    private actData = {};
    private dataSubject: Subject<{ data: any, key: any }> = new Subject<{ data: any, key: any }>();
    public dataSubject$: Observable<{ data: any, key: any }> = this.dataSubject.asObservable();

    constructor() { }

    public pushData(data: any, key: string[]) {
        for (let i = 0; i < key.length; i++) {
            this.actData[key[i]] = data;
        }
        this.dataSubject.next({ data, key });
    }

    public getData() {
        return this.dataSubject$;
    }

    public getActData(key: string): any {
        if (this.actData && this.actData[key]) {
            return { data: this.actData[key], key };
        }

        return { data: null, key: null };
    }
}
