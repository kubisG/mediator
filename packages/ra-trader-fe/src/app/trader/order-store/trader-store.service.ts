import { WebSocketSetup, WebSocketEvent } from "../../core/websocket/decorators/websocket-service.decorator";
import { LOCALE_ID, Inject } from "@angular/core";
import { Store, Actions } from "@ngxs/store";
import { NotifyService } from "../../core/notify/notify.service";
import { RestTraderService } from "../../rest/rest-trader.service";
import { OrderStoreService } from "../../orders/order-store.service";
import { Subject } from "rxjs";
import { Observable } from "rxjs/internal/Observable";

@WebSocketSetup({
    namespace: "trader"
})
export class TraderStoreService extends OrderStoreService {

    private cancelAllResult: Subject<any> = new Subject<any>();
    public cancelAllResult$: Observable<any> = this.cancelAllResult.asObservable();

    constructor(
        store: Store,
        restOrdersService: RestTraderService,
        notifyService: NotifyService,
        @Inject(LOCALE_ID) locale: string,
        actions: Actions,
    ) {
        super(store, restOrdersService, notifyService, locale, actions);
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
        if (data.type && data.type === "cancelAllResult") {
            this.cancelAllResult.next(data);
        }
        // if i change more balances at once (allocation to accounts)
        if (data.type && data.type === "balances") {
            for (let i = 0; i < data.porfolio.length; i++) {
                const newData = { ...data };
                newData.portfolio = data.portfolio[i];
                newData.type = "balance";
                this.balanceInfo.next(newData);
            }
        }
    }
}
