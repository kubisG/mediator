import { Injectable, Inject, LOCALE_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { formatDate } from "@angular/common";
import { environment } from "../../environments/environment";

@Injectable()
export class RestAllocationsService {

    constructor(
        private http: HttpClient,
        @Inject(LOCALE_ID) private locale: string,
    ) { }

    public getAllocations(dateFrom: Date, dateTo: Date, showCompOrders: boolean, showAllMsg: boolean): Promise<any[]> {
        if (dateFrom === null) {
            dateFrom = new Date();
            dateFrom.setHours(0, 0, 0, 0);
        }
        if (dateTo === null) {
            dateTo = new Date();
            dateTo.setHours(23, 59, 59, 99);
        }
        const dateStr = formatDate(dateFrom, "yyyy-MM-dd HH:mm", this.locale) + "~" + formatDate(dateTo, "yyyy-MM-dd HH:mm", this.locale);
        return this.http.post<any[]>(`${environment.apiUrl}/allocations/all/`,
             { dates: dateStr, showComp: showCompOrders, showAllMsg: showAllMsg } )
            .toPromise();
    }

    public getOrderAllocations(raId: string) {
        return this.http.get<any[]>(`${environment.apiUrl}/allocations/raId/${raId}`)
            .toPromise();
    }

    public saveRecord(allocation: any): Promise<any> {
        if (allocation.id) {
            return this.http.put(`${environment.apiUrl}/allocations/${allocation.id}`,
                allocation
            ).toPromise();
        } else {
            return this.http.post(`${environment.apiUrl}/allocations/`,
                allocation
            ).toPromise();
        }
    }

    public delRecord(allocation: any): Promise<any> {
        if (allocation.id) {
            return this.http.delete(`${environment.apiUrl}/allocations/${allocation.id}`,
                allocation
            ).toPromise();
        }
    }

    public delRecords(raId: string): Promise<any> {
        return this.http.delete(`${environment.apiUrl}/allocations/raId/${raId}`).toPromise();
    }

    public getBrokerAlloc(dateFrom: Date, dateTo: Date): Promise<any[]> {
        if (dateFrom === null) {
            dateFrom = new Date();
            dateFrom.setHours(0, 0, 0, 0);
        }
        if (dateTo === null) {
            dateTo = new Date();
            dateTo.setHours(23, 59, 59, 99);
        }
        const dateStr = formatDate(dateFrom, "yyyy-MM-dd HH:mm", this.locale) + "~" + formatDate(dateTo, "yyyy-MM-dd HH:mm", this.locale);
        return this.http.get<any[]>(`${environment.apiUrl}/broker-allocations/all/${dateStr}`)
            .toPromise();
    }
}
