import { Injectable, Inject, LOCALE_ID } from "@angular/core";
import { WebSocketSetup, WebSocketEvent } from "../../core/websocket/decorators/websocket-service.decorator";
import { Store, Actions } from "@ngxs/store";
import { RestBrokerService } from "../../rest/rest-broker.service";
import { NotifyService } from "../../core/notify/notify.service";
import { OrderStoreService } from "../../orders/order-store.service";
import { Observable } from "rxjs/internal/Observable";
import { Subject } from "rxjs";

@WebSocketSetup({
    namespace: "broker"
})
export class BrokerStoreService extends OrderStoreService {

    protected sleuthInfo: Subject<any> = new Subject<any>();
    public sleuthInfo$: Observable<any> = this.sleuthInfo.asObservable();

    constructor(
        store: Store,
        restOrdersService: RestBrokerService,
        notifyService: NotifyService,
        @Inject(LOCALE_ID) locale: string,
        actions: Actions,
    ) {
        super(store, restOrdersService, notifyService, locale, actions);
        this.initBroker();
    }

    private initBroker() {
        this.socketConnected$.subscribe((connected) => {
            if (connected) {
                this.emit("sleuth", {});
            }
        });
    }

    @WebSocketEvent("consume")
    public onConsume(data: any) {
        this.transformMessage(data);
        data = this.prepareReplace(data);
        this.setNewMessage(data);
    }

    @WebSocketEvent("exception")
    public onException(data: any) {
        this.notifyService.pop("error", "WS error", data.message ? data.message : data);
    }

    @WebSocketEvent("info")
    public onInfo(data: any) {
        if (data.type && data.type === "balance") {
            this.balanceInfo.next(data);
        }
    }

    @WebSocketEvent("sleuth")
    public onSleuth(data: any) {
        this.sleuthInfo.next(data);
    }

}
