import { WebSocketEvent } from "../core/websocket/decorators/websocket-service.decorator";
import { LOCALE_ID, Inject } from "@angular/core";
import { WebSocketService } from "../core/websocket/services/websocket.service";
import { Store, Actions } from "@ngxs/store";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { NotifyService } from "../core/notify/notify.service";
import { MessageType } from "@ra/web-shared-fe";

export class AllocationsService extends WebSocketService {

    private store: Store;

    private routingMessageType: { [key: string]: Subject<any> } = {};
    private routingMessageType$: { [key: string]: Observable<any> } = {};

    constructor(
        store: Store,
        protected notifyService: NotifyService,
        @Inject(LOCALE_ID) private locale: string,
        protected actions: Actions,
    ) {
        super(true, actions, store, true);
        this.store = store;
        this.init();
        this.initRouting();
    }

    protected init() {
        this.socketConnected$.subscribe((connected) => {
            if (connected) {
                this.emit("consume", {});
                this.emit("exception", {});
            }
        });
    }

    protected initRouting() {
        for (const route in MessageType) {
            if (MessageType[route]) {
                this.initRoutingMessageType(route);
            }
        }
    }

    protected initRoutingMessageType(messageType: string) {
        if (!this.routingMessageType[messageType]) {
            this.routingMessageType[messageType] = new Subject<any>();
            this.routingMessageType$[messageType] = this.routingMessageType[messageType].asObservable();
        }
    }

    protected setNewMessage(message) {
        const msgType = message.msgType;
        this.initRoutingMessageType(msgType);
        this.routingMessageType[msgType].next(message);
    }

    public getRoutingMessageType(messageType: string) {
        this.initRoutingMessageType(messageType);
        return this.routingMessageType$[messageType];
    }

    public sendMessage(message: any) {
        this.emit("send", message);
    }

    /**
     * Format change
     * @param data message
     */
    transformMessage(data) {
        if (data.TransactTime) {
            data.TransactTime = new Date(data.TransactTime); //  formatDate(data.TransactTime, "MM-dd HH:mm:ss", this.locale);
        } else {
            data.TransactTime = new Date();
        }
        if (data.ValidUntilTime) {
            data.ValidUntilTime = new Date(data.ValidUntilTime); //  formatDate(data.TransactTime, "MM-dd HH:mm:ss", this.locale);
        }
    }

}
