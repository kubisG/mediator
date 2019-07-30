import { HttpClient, HttpRequest, HttpHeaders } from "@angular/common/http";
import { Injectable, InjectionToken, Inject } from "@angular/core";
import { EnvironmentInterface, ENVIRONMENT } from "@ra/web-shared-fe";

@Injectable()
export class RestCompaniesService {

    constructor(
        private http: HttpClient,
        @Inject(ENVIRONMENT) private environment: EnvironmentInterface) { }


    public getCompanies(): Promise<any> {
        return this.http.get(`${this.environment.apiUrl}/companies`,
            { headers: new HttpHeaders().set("X-enable-cache", "true") })
            .toPromise();
    }

    public getCompany(id: number): Promise<any> {
        return this.http.get(`${this.environment.apiUrl}/companies/${id}`)
            .toPromise();
    }

    public delCompany(id: number): Promise<any> {
        return this.http.delete(`${this.environment.apiUrl}/companies/${id}`).toPromise();
    }

    public saveCompany(data: any
    ): Promise<any> {
        const method = data.id ? "PUT" : "POST";
        const url = data.id ? `${this.environment.apiUrl}/companies/${data.id}` : `${this.environment.apiUrl}/companies/create`;
        return this.http.request(method, url, { body: data }).toPromise();
    }

    public saveMyCompany(data: any
        ): Promise<any> {
            const method = "PUT";
            const url = `${this.environment.apiUrl}/companies/my/${data.id}`;
            return this.http.request(method, url, { body: data }).toPromise();
        }

}
