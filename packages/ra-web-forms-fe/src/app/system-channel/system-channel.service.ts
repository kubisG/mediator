import { Injectable } from "@angular/core";
import { WebSocketSetup, WebSocketService, WebSocketEvent } from "@ra/web-core-fe";
import { environment } from "../../environments/environment";
import { Actions, Store } from "@ngxs/store";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { ToasterService } from "angular2-toaster";

@WebSocketSetup({
    namespace: "system",
    url: environment.wsUrl
})
@Injectable({
    providedIn: "root"
})
export class SystemChannelService extends WebSocketService {

    protected newMessagesNotify: Subject<any> = new Subject();
    public newMessagesNotify$: Observable<any> = this.newMessagesNotify.asObservable();

    constructor(
        actions: Actions,
        store: Store,
        protected notifyService: ToasterService,
    ) {
        super(true, actions, store, true);
    }

    @WebSocketEvent("exception")
    public onException(data: any) {
        this.notifyService.pop("error", "WS error", data.message ? data.message : data);
    }

    @WebSocketEvent("info")
    public onInfo(data: any) {
        this.newMessagesNotify.next(data);
        this.notifyService.pop("info", "WS Info", data.message ? data.message : data);
    }

    public onConnect() {
        this.emit("info", {});
        this.emit("exception", {});
    }

    public onDisconnect() {

    }

    public onError() {

    }

}
