import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class RestDiagnostics {

    constructor(private http: HttpClient) { }

    public getSystemStatus(): Promise<{ name: string, status: boolean, host: string }[]> {
        return this.http.get<{ name: string, status: boolean, host: string }[]>(`${environment.apiUrl}/diagnostics`)
            .toPromise();
    }

}
