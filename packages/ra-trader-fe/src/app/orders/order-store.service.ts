import { WebSocketService } from "../core/websocket/services/websocket.service";
import { Subject } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { Store, Actions } from "@ngxs/store";
import { NotifyService } from "../core/notify/notify.service";
import { Inject, LOCALE_ID } from "@angular/core";
import { MessageType } from "@ra/web-shared-fe";
import { IncNewMessages, ClearMessagesCount } from "../header/state/header.actions";
import { RestOrders } from "../rest/rest-orders.interface";
import { parseJsonMessage } from "../core/utils";
import { PreferencesState } from "../preferences/state/preferences.state";
import { OrdStatus } from "@ra/web-shared-fe";
import { ExecType } from "@ra/web-shared-fe";


export class OrderStoreService extends WebSocketService {
    public orderTrees1: { item: any, childs: any[] }[] = [];

    protected routingMessageType: { [key: string]: Subject<any> } = {};
    protected routingMessageType$: { [key: string]: Observable<any> } = {};

    protected newMessagesNotify: Subject<any> = new Subject();
    public newMessagesNotify$: Observable<any> = this.newMessagesNotify.asObservable();

    protected balanceInfo: ReplaySubject<any> = new ReplaySubject<any>(1);
    public balanceInfo$: Observable<any> = this.balanceInfo.asObservable();

    protected store: Store;
    private prefs;
    private isShown = false;

    private messages = [];

    private newMessageRaIDs: { [key: string]: any } = {};
    private executionBuffer: { [key: string]: any[] } = {};

    constructor(
        store: Store,
        protected restOrdersService: RestOrders,
        protected notifyService: NotifyService,
        @Inject(LOCALE_ID) protected locale: string,
        protected actions: Actions,
    ) {
        super(true, actions, store, true);
        this.store = store;
        this.init();
        this.initRouting();
        this.prefs = this.store.selectSnapshot(PreferencesState.getPrefs);
    }

    private addOrUpdateTree(tree: any, message: any) {
        for (let i = 0; i < tree.items.length; i++) {
            // OrigClOrdID
            if (tree.items[i].uniqueId === message.uniqueId) {
                tree.items[i] = message;
                return;
            }
        }
        tree.items.push(message);
    }

    protected init() {
        this.socketConnected$.subscribe((connected) => {
            if (connected) {
                this.emit("consume", {});
                this.emit("info", {});
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

    protected prepareReplace(message): any {
        if ((message.msgType === MessageType.Replace) && (message.OrdStatus === OrdStatus.PendingReplace)) {
            const newMessage = { replaceMessage: null, RaID: null, OrdStatus: null, msgType: null, userId: null };
            newMessage.replaceMessage = { ...message };
            newMessage.RaID = message.RaID;
            newMessage.msgType = message.msgType;
            newMessage.OrdStatus = OrdStatus.PendingReplace;
            newMessage.userId = message.userId;
            return newMessage;
        } else if (message.msgType === MessageType.Cancel) {
            message.replaceMessage = null;
        } else if ((message.msgType === MessageType.Execution) && (message.ExecType === ExecType.Replace)) {
            message.replaceMessage = null;
        } else if (message.msgType === MessageType.OrderCancelReject) {
            message.replaceMessage = null;
        }
        return message;
    }

    protected setNewMessage(message) {
        let msgType = message.msgType;
        if ((message.msgType === MessageType.Order)
            || (message.msgType === MessageType.Cancel)
            || (message.msgType === MessageType.Replace)) {
            msgType = MessageType.Order;
        } else if (message.msgType === MessageType.OrderCancelReject) {
            msgType = MessageType.Execution;
        }

        this.initRoutingMessageType(msgType);
        // for orderCancelReject i have to keep old ClOrdID
        if (message.msgType === MessageType.OrderCancelReject) {
            delete message.ClOrdID;
        }
        if (msgType === MessageType.Execution && !this.newMessageRaIDs[message.RaID]) {
            if (this.executionBuffer[message.RaID]) {
                this.executionBuffer[message.RaID].push(message);
            } else {
                this.executionBuffer[message.RaID] = [message];
            }
            return;
        } else {
            this.newMessageRaIDs[message.RaID] = {};
        }
        this.routingMessageType[msgType].next(message);
        if (this.executionBuffer[message.RaID]) {
            const bufferedMessage = this.executionBuffer[message.RaID];
            delete this.executionBuffer[message.RaID];
            for (let i = 0; i < bufferedMessage.length; i++) {
                console.log("RESEND EXECUTION REPORT", bufferedMessage[i].RaID, bufferedMessage[i]);
                this.routingMessageType[MessageType.Execution].next(bufferedMessage[i]);
            }
        }
        this.newMessagesNotify.next();

        if ((!this.isShown) && (msgType === MessageType.Order)) {
            this.store.dispatch(new IncNewMessages());
        }
    }

    public setShown(value) {
        this.isShown = value;
        if (this.isShown) {
            this.store.dispatch(new ClearMessagesCount());
        }
    }

    public getRoutingMessageType(messageType: string) {
        this.initRoutingMessageType(messageType);
        return this.routingMessageType$[messageType];
    }

    public getFills() {
        return this.restOrdersService.getFills();
    }

    public sendMessage(message: any) {
        this.emit("send", message);
    }

    public cancelAll(cancel: any) {
        this.emit("cancelAll", cancel);
    }

    public getOrderMessages(raId: any) {
        return this.restOrdersService.getMessages(raId);
    }


    private sortOrderTree(index: number, levelClOrdID: string, parentClOrdID?: string) {
        const items = [];
        for (let i = index; i < this.messages.length; i++) {
            if (!(this.messages[i]["processed"])) {
                if (this.messages[i].ClOrdID === levelClOrdID) {
                    items.push({ item: this.messages[i], childs: [] });
                    this.messages[i]["processed"] = true;
                } else if (this.messages[i].OrigClOrdID === levelClOrdID) {
                    items[items.length - 1].childs =
                        items[items.length - 1].childs.concat(this.sortOrderTree(i, this.messages[i].ClOrdID, levelClOrdID));
                }
            }
        }
        return items;
    }

    public getMessages(raID: any) {
        return this.restOrdersService.getMessages(raID);
    }

    public createMessageTree(raID: any) {
        return this.restOrdersService.getMessages(raID).then((messages) => {
            this.messages = messages;
            this.orderTrees1 = this.sortOrderTree(0, messages[0].ClOrdID);
            return this.orderTrees1;
        });
    }

    public loadStoredOrders(dateFrom: Date, dateTo: Date, showCompOrders: boolean, app: number, clOrdLinkID?: string, isPhone?: string):
     Promise<any[]> {
        return this.restOrdersService.getOrders(dateFrom, dateTo, showCompOrders, this.prefs.gtcGtd, app, clOrdLinkID, isPhone)
        .then((orders) => {
            parseJsonMessage(orders);
            for (let i = 0; i < orders.length; i++) {
                this.newMessageRaIDs[orders[i].RaID] = {};
                this.transformMessage(orders[i]);
                if (orders[i].replaceMessage && (typeof orders[i].replaceMessage === "string"
                    || orders[i].replaceMessage instanceof String)) {
                    orders[i].replaceMessage = JSON.parse(orders[i].replaceMessage);
                }
            }
            this.newMessagesNotify.next();
            return orders;
        });
    }

    /**
     * Format change
     * @param data message
     */
    transformMessage(data) {
        if (data.Placed) {
            data.Placed = new Date(data.Placed); //  formatDate(data.Placed, "MM-dd HH:mm:ss", this.locale);
        }
        if (data.TransactTime) {
            data.TransactTime = new Date(data.TransactTime); //  formatDate(data.TransactTime, "MM-dd HH:mm:ss", this.locale);
        }
        if (data.LocateReqd) {
            data.LocateReqd = ((data.LocateReqd === "true") || (data.LocateReqd === "Y") || (data.LocateReqd === true));
        }
        if (data.OddLot) {
            data.OddLot = ((data.OddLot === "Y") || (data.OddLot === "true") || (data.OddLot === true));
        }
        if (data.Rule80A) {
            data.Rule80A = ((data.Rule80A === "Y") || (data.Rule80A === "true") || (data.Rule80A === true));
        }
    }

    public showPopUp(msg) {
        // || (msg.msgType === MessageType.Cancel)
        if (msg && (msg.msgType === MessageType.Order) || (msg.msgType === MessageType.Replace)) {
            return true;
        }
        if (msg && msg.msgType === MessageType.Execution &&
            (msg.OrdStatus === OrdStatus.PartiallyFilled || msg.OrdStatus === OrdStatus.Filled || msg.OrdStatus === OrdStatus.Rejected)) {
            return true;
        }
        return false;
    }

}
