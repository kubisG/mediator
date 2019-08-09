import { WebSocketEvent } from "../core/websocket/decorators/websocket-service.decorator";
import { LOCALE_ID, Inject } from "@angular/core";
import { WebSocketService } from "../core/websocket/services/websocket.service";
import { Store, Actions } from "@ngxs/store";
import { MessageType } from "@ra/web-shared-fe";
import { RestIoisService } from "../rest/rest-iois.service";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { NotifyService } from "../core/notify/notify.service";
import { hitlistFormatValue } from "@ra/web-shared-fe";

export class IoiService extends WebSocketService {

    public hitlistFormat = hitlistFormatValue;
    protected routingMessageType: { [key: string]: Subject<any> } = {};
    protected routingMessageType$: { [key: string]: Observable<any> } = {};

    protected store: Store;

    constructor(
        store: Store,
        private restIoisService: RestIoisService,
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

    public getIois(dateFrom, dateTo) {
        return this.restIoisService.getIois(dateFrom, dateTo, false);
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
        }
        if (data.ValidUntilTime) {
            data.ValidUntilTime = new Date(data.ValidUntilTime); //  formatDate(data.TransactTime, "MM-dd HH:mm:ss", this.locale);
        }
    }

    getColumns(lists): any[] {
        const that = this;
        return [
            { caption: "Transact Time", dataField: "TransactTime", valueFormatter: function (data) {
                return that.hitlistFormat(data,
                    { locale: that.locale, dataField: "createDate", dataType: "date", format: "HH:mm:ss.S" }
                );
            } },
            { caption: "Type", dataField: "Type" },
            { caption: "ValidUntilTime", dataField: "ValidUntilTime" , valueFormatter: function (data) {
                return that.hitlistFormat(data,
                    { locale: that.locale, dataField: "createDate", dataType: "date", format: "y/MM/dd" }
                );
            }},
            { caption: "Symbol", dataField: "Symbol" },
            { caption: "IOIQty", dataField: "IOIQty" },
            { caption: "Price", dataField: "Price", type: ["numericColumn"] },
            { caption: "Currency", dataField: "Currency", valueFormatter: function (data) {
                return that.hitlistFormat(data,
                    {
                        dataField: "Currency", dataType: "lookup",
                        lookup: { dataSource: lists["Currency"], valueExpr: "value", displayExpr: "name" }
                    }
                );
            } },
            { caption: "Side", dataField: "Side", valueFormatter: function (data) {
                return that.hitlistFormat(data,
                    {
                        dataField: "Side", dataType: "lookup",
                        lookup: { dataSource: lists["Side"], valueExpr: "value", displayExpr: "name" }
                    }
                );
            } },
            { caption: "Stipulations", dataField: "Text" },
            { caption: "Counterparty", dataField: "TargetCompID" },
        ];
    }
}
