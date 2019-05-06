import { Injectable } from "@angular/core";
import { WebSocketSetup } from "../decorators/websocket-service.decorator";
import { WebSocketService } from "./websocket.service";
import { Store, Actions } from "@ngxs/store";

@Injectable({
    providedIn: "root",
})
@WebSocketSetup({ namespace: "" })
export class StatusWSService extends WebSocketService {

    constructor(
        store: Store,
        actions: Actions,
    ) {
        super(true, actions, store, false);
    }

    public getStatusObservable() {
        return this.socketConnected$;
    }

}
