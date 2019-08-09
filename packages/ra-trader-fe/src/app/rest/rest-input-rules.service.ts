import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class RestInputRulesService {

    constructor(private http: HttpClient) { }

    public getInputRules(): Promise<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/input-rules`,
            { headers: new HttpHeaders().set("X-enable-cache", "true") })
            .toPromise();
    }

    public getAdminInputRules(): Promise<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/input-rules/admin`)
            .toPromise();
    }

    public saveInputRules(tree: { inputs: any[], del: any[] }): Promise<any[]> {
        return this.http.post<any[]>(`${environment.apiUrl}/input-rules`, tree).toPromise();
    }

    public getRules(label: string): Promise<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/input-rules/${label}`,
        { headers: new HttpHeaders().set("X-enable-cache", "true") }).toPromise();
    }

}
