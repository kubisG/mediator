import * as io from "socket.io-client";
import { Injectable } from "@angular/core";
import { HttpClient, HttpBackend } from "@angular/common/http";
import { EikonConfig } from "./eikon-config.interface";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { Observable } from "rxjs/internal/Observable";
import { WsService } from "./ws.service";

@Injectable()
export class EikonService {

    private http: HttpClient;
    private config: EikonConfig;
    private sessionToken: string;
    private socket: any;

    private socketConnected = new ReplaySubject<boolean>(1);
    public socketConnected$ = this.socketConnected.asObservable();

    private socketException = new ReplaySubject<any>(1);
    public socketException$ = this.socketException.asObservable();

    private enabled: ReplaySubject<any> = new ReplaySubject<any>(1);
    public enabled$: Observable<any> = this.enabled.asObservable();

    constructor(
        handler: HttpBackend,
        private wsService: WsService,
    ) {
        this.http = new HttpClient(handler);
    }

    private wsConnect() {
        this.wsService.connect(`${this.config.wsUrl}/sxs/v1/notifications?sessionToken=${this.sessionToken}&linkType=3`);
        this.wsService.connectSubject$.subscribe((event) => {

        });
        this.wsService.eventSubject$.subscribe((event) => {
            console.log(event);
        });
    }

    public setEikonConfig(config: EikonConfig) {
        this.config = config;
    }

    public ping(): Promise<number> {
        return this.http.get<number>(`${this.config.url}/ping`).toPromise();
    }

    public handShake(): Promise<boolean> {
        if (this.sessionToken) {
            Promise.resolve(true);
        }
        return this.http.post<any>(`${this.config.url}/sxs/v1`, {
            command: "handshake",
            productId: this.config.productId,
            appKey: this.config.appKey
        }).toPromise().then((data) => {
            this.sessionToken = data.sessionToken;
            this.enabled.next(true);
            this.wsConnect();
            return true;
        });
    }

    public openApp(appId: string, context: any, link: boolean = false): Promise<string> {
        return this.http.post<any>(`${this.config.url}/sxs/v1`, {
            command: "launch",
            sessionToken: this.sessionToken,
            appId,
            context,
        }).toPromise().then((data) => {
            if (data.isSuccess) {
                this.linkApp(data.instanceId);
                return data.instanceId;
            }
            return data.error.message;
        });
    }

    public linkApp(targetInstanceId: string) {
        return this.http.post<any>(`${this.config.url}/sxs/v1`, {
            command: "link",
            sessionToken: this.sessionToken,
            targetInstanceId
        }).toPromise().then((data) => {

        });
    }

    public getAppList() {
        return this.http.post<any>(`${this.config.url}/sxs/v1`, {
            Command: "getAppList",
            sessionToken: this.sessionToken,
        }).toPromise().then((data) => {
            console.log(data);
        });
    }

}
