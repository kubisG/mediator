import { WebSocketSetup, WebSocketEvent } from "../core/websocket/decorators/websocket-service.decorator";
import { Injectable, LOCALE_ID, Inject } from "@angular/core";
import { WebSocketService } from "../core/websocket/services/websocket.service";
import { Store, Actions } from "@ngxs/store";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { Observable } from "rxjs/internal/Observable";

@WebSocketSetup({
    namespace: "trader"
})
@Injectable({
    providedIn: "root",
})
export class PortfolioService extends WebSocketService {

    private balanceInfo: ReplaySubject<any> = new ReplaySubject<any>(1);
    public balanceInfo$: Observable<any> = this.balanceInfo.asObservable();

    constructor(
        store: Store,
        private actions: Actions,
    ) {
        super(true, actions, store, true);
        this.init();
    }

    private init() {
        this.socketConnected$.subscribe((connected) => {
            if (connected) {
                this.emit("info", {});
            }
        });
    }

    @WebSocketEvent("info")
    public onInfo(data: any) {
        if (data.type && data.type === "balance") {
            this.balanceInfo.next(data);
        }
        // if i change more balances at once (allocation to accounts)
        if (data.type && data.type === "balances") {
            for (let i = 0; i < data.porfolio.length; i++) {
                const newData = {...data};
                newData.portfolio = data.portfolio[i];
                newData.type = "balance";
                this.balanceInfo.next(newData);
            }
        }
    }

}
