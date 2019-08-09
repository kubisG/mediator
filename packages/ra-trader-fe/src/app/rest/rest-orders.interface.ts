export interface RestOrders {
    getOrders(dateFrom: Date, dateTo: Date, showCompOrders: boolean, gtcGtd: boolean, app: number, clOrdLinkID?: string
        , isPhone?: string): Promise<any[]>;

    getMessages(raID: any);

    getFills();

    getTrades(symbol: any, currency: any);

    getChildsQty(clOrdLinkID: any);
}
