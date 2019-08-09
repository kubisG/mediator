import { WebSocketSetup, WebSocketEvent } from "../core/websocket/decorators/websocket-service.decorator";
import { LOCALE_ID, Inject } from "@angular/core";
import { Store, Actions } from "@ngxs/store";
import { NotifyService } from "../core/notify/notify.service";
import { RestTraderService } from "../rest/rest-trader.service";
import { OrderStoreService } from "../orders/order-store.service";
import { SpecType } from "@ra/web-shared-fe";
import { AuthState } from "../core/authentication/state/auth.state";
import { AuthStateModel } from "../core/authentication/state/auth.model";

@WebSocketSetup({
    namespace: "trader",

})
export class PhoneStoreService extends OrderStoreService {

    public user: AuthStateModel;


    constructor(
        store: Store,
        public restOrdersService: RestTraderService,
        notifyService: NotifyService,
        @Inject(LOCALE_ID) locale: string,
        actions: Actions,
    ) {
        super(store, restOrdersService, notifyService, locale, actions);
        this.user = this.store.selectSnapshot(AuthState.getUser);
    }

    @WebSocketEvent("consume")
    public onConsume(data: any) {
        if (data.specType === SpecType.phone) {
            this.transformMessage(data);
            data = this.prepareReplace(data);
            this.setNewMessage(data);
        }
    }

    @WebSocketEvent("exception")
    public onException(data: any) {
        this.notifyService.pop("error", "WS error", data.message ? data.message : data);
    }

    @WebSocketEvent("info")
    public onInfo(data: any) {
    }

    public sendMessage(message: any) {
        message.specType = SpecType.phone;
        message.TargetCompID = this.user.compQueueBroker;
        message.DeliverToCompID = this.user.compQueueBroker;
        super.sendMessage(message);
    }

    public getClients(): any {
        return this.restOrdersService.getClients();
    }
}
