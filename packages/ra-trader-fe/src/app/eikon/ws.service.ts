import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Observable } from "rxjs/internal/Observable";

@Injectable()
export class WsService {

    private ws: WebSocket;
    private connectSubject: Subject<any> = new Subject<any>();
    private eventSubject: Subject<any> = new Subject<any>();

    public connectSubject$: Observable<any> = this.connectSubject.asObservable();
    public eventSubject$: Observable<any> = this.eventSubject.asObservable();

    public connect(url: string) {
        this.ws = new WebSocket(url);
        this.ws.onopen = (event) => {
            this.connectSubject.next(event);
        };
        this.ws.onmessage = (msg: any) => {
            this.eventSubject.next(msg);
        };
        this.ws.onerror = (err) => {
            this.eventSubject.error(err);
        };
        this.ws.onclose = (close) => {
            this.eventSubject.complete();
            this.connectSubject.complete();
        };
    }

    public send(msg: any) {
        this.ws.send(msg);
    }

}
