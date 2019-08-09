import { WebSocketSetup, WebSocketEvent } from "../../core/websocket/decorators/websocket-service.decorator";
import { Injectable, LOCALE_ID, Inject } from "@angular/core";

import { Store, Actions } from "@ngxs/store";
import { AllocationsService } from "../../allocations/allocations.service";
import { NotifyService } from "../../core/notify/notify.service";

@WebSocketSetup({
    namespace: "allocations"
})
@Injectable({
    providedIn: "root",
})
export class TraderAllocationsService extends AllocationsService {

 constructor(
    store: Store,
    notifyService: NotifyService,
    @Inject(LOCALE_ID) locale: string,
    actions: Actions,
) {
    super(store, notifyService, locale, actions);
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

