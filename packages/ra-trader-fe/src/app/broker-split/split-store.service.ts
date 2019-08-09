import { WebSocketSetup, WebSocketEvent } from "../core/websocket/decorators/websocket-service.decorator";
import { LOCALE_ID, Inject } from "@angular/core";
import { Store, Actions } from "@ngxs/store";
import { NotifyService } from "../core/notify/notify.service";
import { RestTraderService } from "../rest/rest-trader.service";
import { OrderStoreService } from "../orders/order-store.service";

@WebSocketSetup({
    namespace: "trader"
})
export class SplitStoreService extends OrderStoreService {

    public parentOrder;

    constructor(
        store: Store,
        restOrdersService: RestTraderService,
        notifyService: NotifyService,
        @Inject(LOCALE_ID) locale: string,
        actions: Actions,
    ) {
        super(store, restOrdersService, notifyService, locale, actions);
    }

    setParentOrder(order) {
        this.parentOrder = order;
    }

    @WebSocketEvent("consume")
    public onConsume(data: any) {
        if (this.parentOrder && data.ClOrdLinkID === this.parentOrder.RaID) {
            this.transformMessage(data);
            data = this.prepareReplace(data);
            this.setNewMessage(data);
        }
    }

    @WebSocketEvent("exception")
    public onException(data: any) {
        this.notifyService.pop("error", "WS error", data.message ? data.message : data);
    }

}
