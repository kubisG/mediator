import { Injectable, Inject, LOCALE_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { formatDate } from "@angular/common";
import { RestOrders } from "./rest-orders.interface";

@Injectable()
export class RestTraderService implements RestOrders {

    constructor(
        private http: HttpClient,
        @Inject(LOCALE_ID) private locale: string
    ) { }

    /**
     * TODO : move parametr(date) manipulation outside rest service
     * @param dateFrom
     * @param dateTo
     */
    public getOrders(dateFrom: Date, dateTo: Date, showCompOrders: boolean, gtcGtd: boolean,
        app: number, clOrdLinkID?: string, isPhone?: string): Promise<any[]> {
        if ((!dateFrom) || (dateFrom === null)) {
            dateFrom = new Date();
            dateFrom.setHours(0, 0, 0, 0);
        }
        if ((!dateTo) || (dateTo === null)) {
            dateTo = new Date();
            dateTo.setHours(23, 59, 59, 99);
        }
        const dateStr = formatDate(dateFrom, "yyyy-MM-dd HH:mm", this.locale) + "~" + formatDate(dateTo, "yyyy-MM-dd HH:mm", this.locale);

        const data = { date: dateStr, comp: showCompOrders, gtcGtd: gtcGtd, app: app, clOrdLinkID: clOrdLinkID, isPhone: isPhone };
        return this.http.post<any[]>(`${environment.apiUrl}/trader/all`, data)
            .toPromise();
    }

    public getChildsQty(clOrdLinkID: any) {
        return this.http.get<any[]>(`${environment.apiUrl}/trader/childsQty/${clOrdLinkID}`).toPromise();
    }


    public getMessages(raID: any) {
        return this.http.get<any[]>(`${environment.apiUrl}/trader/messages/${raID}`).toPromise();
    }

    public getFills() {
        return this.http.get<any[]>(`${environment.apiUrl}/trader/fills`).toPromise();
    }

    public getTrades(symbol: any, currency: any) {
        return this.http.get<any[]>(`${environment.apiUrl}/trader/trades/${symbol}/${currency}`).toPromise();
    }

    public getClients() {
        return this.http.get<any[]>(`${environment.apiUrl}/trader/clients`).toPromise();
    }

}
