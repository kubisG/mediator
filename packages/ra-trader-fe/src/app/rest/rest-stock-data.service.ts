import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class RestStockDataService {

    constructor(private http: HttpClient) { }

    public getAllPx(): Promise<[]> {
        return this.http.get<[]>(`${environment.apiUrl}/stock-data`)
            .toPromise();
    }

    public getSymbolPx(symbol: string): Promise<any> {
        return this.http.get(`${environment.apiUrl}/stock-data/${symbol}`)
            .toPromise();
    }

    public getSymbolAllPx(symbol: string): Promise<any> {
        return this.http.get(`${environment.apiUrl}/stock-data/history/${symbol}`)
            .toPromise();
    }

}
