import { WebSocketSetup, WebSocketEvent } from "../../core/websocket/decorators/websocket-service.decorator";
import { Injectable, LOCALE_ID, Inject } from "@angular/core";
import { Store, Actions } from "@ngxs/store";
import { RestIoisService } from "../../rest/rest-iois.service";
import { NotifyService } from "../../core/notify/notify.service";
import { IoiService } from "../../iois/ioi.service";

@WebSocketSetup({
    namespace: "broker-iois"
})
@Injectable({
    providedIn: "root",
})
export class BrokerIoiService extends IoiService {

    constructor(
        store: Store,
        restIoisService: RestIoisService,
        notifyService: NotifyService,
        @Inject(LOCALE_ID) locale: string,
        actions: Actions,
    ) {
        super(store, restIoisService, notifyService, locale, actions);
    }

    @WebSocketEvent("consume")
    public onConsume(data: any) {
        this.transformMessage(data);
        this.setNewMessage(data);
    }

    @WebSocketEvent("exception")
    public onException(data: any) {
        this.notifyService.pop("error", "WS error", data.message);
    }

}
