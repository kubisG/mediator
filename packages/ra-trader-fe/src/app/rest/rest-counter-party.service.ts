import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";

@Injectable()
export class RestCounterPartyService {

    constructor(private http: HttpClient) { }

    public getRecords(type?: number): Promise<any> {

        if (type) {
            return this.http.get(`${environment.apiUrl}/counter-party/type/${type}`,
                { headers: new HttpHeaders().set("X-enable-cache", "true") })
                .toPromise();
        } else {
            return this.http.get(`${environment.apiUrl}/counter-party`,
                { headers: new HttpHeaders().set("X-enable-cache", "true") })
                .toPromise();
        }
    }


    public getRecord(id: number): Promise<any> {
        return this.http.get(`${environment.apiUrl}/counter-party/${id}`)
            .toPromise();
    }

    public delRecord(id: number): Promise<any> {
        return this.http.delete(`${environment.apiUrl}/counter-party/${id}`).toPromise();
    }

    public saveRecord(data: any): Promise<any> {
        return this.http.post(`${environment.apiUrl}/counter-party`, data).toPromise();
    }
}
