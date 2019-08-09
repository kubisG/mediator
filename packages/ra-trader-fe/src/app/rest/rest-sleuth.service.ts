import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class RestSleuthService {

    constructor(private http: HttpClient) { }

    public getSleuthData(data): Promise<any> {
        return this.http.get(`${environment.apiUrl}/sleuth/${data.Side}/${data.Symbol}`)
            .toPromise();
    }
}
