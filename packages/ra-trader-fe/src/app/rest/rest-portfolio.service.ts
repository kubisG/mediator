import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class RestPortfolioService {

    constructor(private http: HttpClient) { }

    public getPortfolio(company: boolean = false): Promise<any> {
        if (company) {
            return this.http.get(`${environment.apiUrl}/portfolio/company`)
                .toPromise();
        } else {
            return this.http.get(`${environment.apiUrl}/portfolio`)
                .toPromise();
        }
    }

    public getPortfolioRow(id: number): Promise<any> {
        return this.http.get(`${environment.apiUrl}/portfolio/${id}`)
            .toPromise();
    }

    public saveRecord(portfolio: any): Promise<any> {
        if (portfolio.id) {
            return this.http.put(`${environment.apiUrl}/portfolio/${portfolio.id}`,
                portfolio
            ).toPromise();
        }
    }

}
