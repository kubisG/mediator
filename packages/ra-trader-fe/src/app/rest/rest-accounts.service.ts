import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";

@Injectable()
export class RestAccountsService {

    constructor(private http: HttpClient) { }

    public getAccounts(): Promise<any> {
        return this.http.get(`${environment.apiUrl}/accounts`,
        { headers: new HttpHeaders().set("X-enable-cache", "true") })
            .toPromise();
    }

    public getAccount(id: number): Promise<any> {
        return this.http.get(`${environment.apiUrl}/accounts/${id}`)
            .toPromise();
    }

    public delAccount(id: number): Promise<any> {
        return this.http.delete(`${environment.apiUrl}/accounts/${id}`).toPromise();
    }

    public saveAccount(data: any): Promise<any> {
        return this.http.post(`${environment.apiUrl}/accounts`, data).toPromise();
    }
}
