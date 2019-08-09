import { Injectable, Inject, LOCALE_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { formatDate } from "@angular/common";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root",
})
export class RestFormsExternalService {

    constructor(private http: HttpClient,
        @Inject(LOCALE_ID) private locale: string) {
    }

    public getAllData(params): Promise<any> {
        return this.http.post<any>(`${environment.apiUrl}/forms/external`,
            { url: params })
            .toPromise();
    }
}
