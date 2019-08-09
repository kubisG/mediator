import { Injectable } from "@angular/core";
import { WebSocketSetup, WebSocketService, WebSocketEvent } from "@ra/web-core-fe";
import { environment } from "../../environments/environment";
import { Actions, Store } from "@ngxs/store";
import { Observable } from "rxjs/internal/Observable";
import { ChannelsMap } from "@ra/web-core-fe";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { StoreListItem } from "../monitor-core/stores-list/stores-list-item-interface";

@WebSocketSetup({
    namespace: "monitor",
    url: environment.wsUrl
})
@Injectable({
    providedIn: "root"
})
export class MonitorDataService extends WebSocketService {

    public channelsMap: ChannelsMap = new ChannelsMap();
    public channelIdPrefix = "monitorGrid_";
    private itr = 0;

    public storesList: ReplaySubject<StoreListItem[]> = new ReplaySubject<StoreListItem[]>(1);
    public storesList$: Observable<StoreListItem[]> = this.storesList.asObservable();

    constructor(
        actions: Actions,
        store: Store,
    ) {
        super(true, actions, store, true);
    }

    private getChannelName(channelId: string) {
        return channelId ? channelId : "all";
    }

    public onConnect() {
        this.emit("response", {});
        this.emit("request", { type: "init" });
    }

    public onDisconnect() {

    }

    public onError() {

    }

    public channelCloseEvent(channelId: string) {
        return (event) => {
            this.requestUnsubscribe(channelId);
        };
    }

    public requestUnsubscribe(channelId: string) {
        this.emit("request", {
            channelId,
            type: "unsubscribe",
        });
    }

    public requestSubscribeData(query: string = "OS", page: number = 0, channelId?: string) {
        const requestChannelId = channelId ? channelId : `${this.channelIdPrefix}${this.itr}`;
        const request = {
            query,
            channelId: requestChannelId,
            type: "subscribe",
            page,
        };
        this.emit("request", request);
        if (!channelId) {
            this.itr++;
        }
        return requestChannelId;
    }

    public getDataObservable(channelId: string): Observable<any> {
        return this.channelsMap.getChannelMethod(channelId, "data").asObservable();
    }

    public getSubscribeOkObservable(channelId: string): Observable<any> {
        return this.channelsMap.getChannelMethod(channelId, "subscribeOk").asObservable();
    }

    public getSubscribeErrObservable(channelId: string): Observable<any> {
        return this.channelsMap.getChannelMethod(channelId, "subscribeErr").asObservable();
    }

    public getPageObservable(channelId: string): Observable<any> {
        return this.channelsMap.getChannelMethod(channelId, "page").asObservable();
    }

    public getColumnsObservable(channelId: string): Observable<any> {
        return this.channelsMap.getChannelMethod(channelId, "columns").asObservable();
    }

    public getInitOkObservable(channelId: string): Observable<any> {
        return this.channelsMap.getChannelMethod(channelId, "initOk").asObservable();
    }

    @WebSocketEvent("stores")
    public onStores(data) {
        // this.storesListService.addItems(data);
    }

    @WebSocketEvent("data")
    public onData(data) {
        console.log("data", data);
        for (const host of data.hosts) {
            this.channelsMap.getChannelMethod(this.getChannelName(host.channelId), "data").next(data.data);
        }
    }

    @WebSocketEvent("subscribeOk")
    public onSubscribeOk(data) {
        console.log("subscribeOk", data);
        return this.channelsMap.getChannelMethod(this.getChannelName(data.channelId), "subscribeOk").next({
            snapshot: data.snapshot,
            columns: data.columns,
        });
    }

    @WebSocketEvent("initOk")
    public onInitOk(data) {
        if (data.stores) {
            this.storesList.next(data.stores);
        }
        return this.channelsMap.getChannelMethod(this.getChannelName(data.channelId), "initOk").next({
            stores: data.stores,
        });
    }

    @WebSocketEvent("subscribeErr")
    public onSubscribeErr(data) {
        return this.channelsMap.getChannelMethod(this.getChannelName(data.channelId), "subscribeErr").next(data);
    }

    @WebSocketEvent("page")
    public onPage(data) {
        for (const host of data.hosts) {
            return this.channelsMap.getChannelMethod(this.getChannelName(host.channelId), "page").next({
                page: data.newPage,
                pageCount: data.newPageCount
            });
        }
    }

    @WebSocketEvent("columns")
    public onColumns(data) {
    }

}
