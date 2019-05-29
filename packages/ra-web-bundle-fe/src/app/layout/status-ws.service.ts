import { Injectable } from "@angular/core";
import { Store, Actions } from "@ngxs/store";
import { WebSocketSetup, WebSocketService, WebSocketEvent } from "@ra/web-core-fe";
import { environment } from "../../environments/environment";

@WebSocketSetup({
    namespace: "",
    url: environment.wsUrl
})
@Injectable({
    providedIn: "root",
})
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
