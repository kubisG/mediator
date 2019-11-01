import { Injectable } from "@nestjs/common";

import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";

@Injectable()
export class PhoneService {

    protected consumeBrokerPhoneSubject: Subject<any> = new Subject<any>();
    protected consumeBrokerPhoneSubject$: Observable<any> = this.consumeBrokerPhoneSubject.asObservable();
    protected consumeTraderPhoneSubject: Subject<any> = new Subject<any>();
    protected consumeTraderPhoneSubject$: Observable<any> = this.consumeTraderPhoneSubject.asObservable();

    constructor(
    ) {
    }

    public async sendBrokerMsg(data: any, userData: any) {
        this.consumeBrokerPhoneSubject.next({ message: data, userData });
    }

    public getBrokerPhoneSubject(): Subject<any> {
        return this.consumeBrokerPhoneSubject;
    }

    public async sendTraderMsg(data: any, userData: any) {
        this.consumeTraderPhoneSubject.next({ message: data, userData });
    }

    public getTraderPhoneSubject(): Subject<any> {
        return this.consumeTraderPhoneSubject;
    }

}
