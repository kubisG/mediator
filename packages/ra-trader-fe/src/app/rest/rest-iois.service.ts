import { Injectable, Inject, LOCALE_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { formatDate } from "@angular/common";
import { environment } from "../../environments/environment";

@Injectable()
export class RestIoisService {

    constructor(
        private http: HttpClient,
        @Inject(LOCALE_ID) private locale: string,
    ) { }

    public getIois(dateFrom: Date, dateTo: Date, showCompOrders: boolean): Promise<any[]> {
        if (dateFrom === null) {
            dateFrom = new Date();
            dateFrom.setHours(0, 0, 0, 0);
        }
        if (dateTo === null) {
            dateTo = new Date();
            dateTo.setHours(23, 59, 59, 99);
        }
        const dateStr = formatDate(dateFrom, "yyyy-MM-dd HH:mm", this.locale) + "~" + formatDate(dateTo, "yyyy-MM-dd HH:mm", this.locale);
        return this.http.get<any[]>(`${environment.apiUrl}/trader/iois/all/${dateStr}/${showCompOrders}`)
            .toPromise();
    }

    public saveRecord(ioi: any): Promise<any> {
        if (ioi.id) {
            return this.http.put(`${environment.apiUrl}/trader/iois/${ioi.id}`,
                ioi
            ).toPromise();
        } else {
            return this.http.post(`${environment.apiUrl}/trader/iois/`,
                ioi
            ).toPromise();
        }
    }

    public delRecord(allocation: any): Promise<any> {
        if (allocation.id) {
            return this.http.delete(`${environment.apiUrl}/trader/iois/${allocation.id}`,
                allocation
            ).toPromise();
        }
    }
}
