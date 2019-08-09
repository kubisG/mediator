import { Injectable, Inject, LOCALE_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { formatDate } from "@angular/common";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root",
})
export class RestFormsService {

    constructor(private http: HttpClient,
        @Inject(LOCALE_ID) private locale: string) {
    }

    public getData(dateFrom: Date, dateTo: Date, typ: string): Promise<any[]> {
        if (dateFrom === null) {
            dateFrom = new Date();
            dateFrom.setHours(0, 0, 0, 0);
        }
        if (dateTo === null) {
            dateTo = new Date();
            dateTo.setHours(23, 59, 59, 99);
        }
        const dateStr = formatDate(dateFrom, "yyyy-MM-dd HH:mm", this.locale) + "~" + formatDate(dateTo, "yyyy-MM-dd HH:mm", this.locale);
        return this.http.get<any[]>(`${environment.apiUrl}/forms/all/${typ}/${dateStr}`)
            .toPromise();
    }

    public getSubRules(typ: string): Promise<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/forms/subrules/${typ}`)
            .toPromise();
    }

    public saveData(data: any): Promise<any> {
        return this.http.post(`${environment.apiUrl}/forms`,
            data
        ).toPromise();
    }

    public deleteData(data: any): Promise<any> {
        if (data.id) {
            return this.http.delete(`${environment.apiUrl}/forms/${data.id}`,
                data
            ).toPromise();
        } else {
            Promise.reject({});
        }
    }

    public getAllData(): Promise<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/forms/lists`)
            .toPromise();
    }

    public getSpecData(id): Promise<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/forms/lists/${id}`)
            .toPromise();
    }

}
