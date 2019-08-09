import { Injectable, Inject, LOCALE_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root",
})
export class RestFormsSpecService {

    constructor(private http: HttpClient,
        @Inject(LOCALE_ID) private locale: string) {
    }

    public getAllData(): Promise<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/admin-spec/all`)
            .toPromise();
    }

    public getData(id): Promise<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/admin-spec/${id}`)
            .toPromise();
    }

    public saveData(data: any): Promise<any> {
        return this.http.post(`${environment.apiUrl}/admin-spec`,
            data
        ).toPromise();
    }

    public deleteData(data: any): Promise<any> {
        if (data.id) {
            return this.http.delete(`${environment.apiUrl}/admin-spec/${data.id}`,
                data
            ).toPromise();
        }
    }
}
