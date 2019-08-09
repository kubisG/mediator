import { WebSocketService } from "./websocket/services/websocket.service";
import { Injectable } from "@angular/core";
import { WebSocketSetup, WebSocketEvent } from "./websocket/decorators/websocket-service.decorator";
import { Store, Actions } from "@ngxs/store";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";

@WebSocketSetup({ namespace: "diagnostic" })
@Injectable({
    providedIn: "root",
})
export class HubService extends WebSocketService {

    private store: Store;
    protected statusNotify: Subject<any> = new Subject();
    public statusNotify$: Observable<any> = this.statusNotify.asObservable();
    private disconnected = 0;

    private statuses: string[] = [];

    constructor(
        store: Store,
        actions: Actions,
    ) {
        super(true, actions, store, true);
        this.store = store;
        this.init();
    }

    private init() {
        this.socketConnected$.subscribe((connected) => {
            if (connected) {
                this.emit("status", {});
            }
        });
    }

    @WebSocketEvent("status")
    public onConsume(data: any) {
        if (data.msg) {
            const ind = data.type + data.msg.TargetCompID;
            if (!(this.statuses[ind])) {
                this.statuses[ind] = data.msg.Text;
                if (data.msg.Text === "DOWN") {
                    this.disconnected++;
                    this.statusNotify.next({ ...data, disconnectedNum: this.disconnected });
                }
            } else if (this.statuses[ind] !== data.msg.Text) {
                if (data.msg.Text === "DOWN") {
                    this.disconnected++;
                } else {
                    this.disconnected--;
                }
                this.statuses[ind] = data.msg.Text;
                this.statusNotify.next({ ...data, disconnectedNum: this.disconnected });
            }
        }
    }

    public getStatuses() {
        return this.statusNotify$;
    }

    public getActStatus() {
        return this.statuses;
    }

    public getDisconnectedNum() {
        return this.disconnected;
    }
}
