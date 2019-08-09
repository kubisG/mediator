import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";

@Injectable()
export class RestCompaniesService {

    constructor(private http: HttpClient) { }

    /**
     * TODO : move paramter manipulation outside rest service
     * @param skip
     * @param take
     * @param sort
     * @param filter
     */
    private createParams(skip?: string, take?: string, sort?: any[], filter?: any) {
        const params = {};
        if (skip) {
            params["skip"] = skip;
        }
        if (take) {
            params["take"] = take;
        }
        if (sort) {
            params["sort"] = sort[0].selector;
            params["sortDir"] = sort[0].desc ? "DESC" : "ASC";
        }
        if (filter) {
            params["filter"] = JSON.stringify(filter);
        }
        return params;
    }

    public getCompanies(skip?: string, take?: string, sort?: any[], filter?: any): Promise<any> {
        return this.http.get(`${environment.apiUrl}/companies`,
            { params: this.createParams(skip, take, sort, filter) ,
             headers: new HttpHeaders().set("X-enable-cache", "true") })
            .toPromise();
    }

    public getCompany(id: number): Promise<any> {
        return this.http.get(`${environment.apiUrl}/companies/${id}`)
            .toPromise();
    }

    public delCompany(id: number): Promise<any> {
        return this.http.delete(`${environment.apiUrl}/companies/${id}`).toPromise();
    }

    public saveCompany(data: any
    ): Promise<any> {
        const method = data.id ? "PUT" : "POST";
        const url = data.id ? `${environment.apiUrl}/companies/${data.id}` : `${environment.apiUrl}/companies/create`;
        return this.http.request(method, url, { body: data }).toPromise();
    }

    public saveMyCompany(data: any
        ): Promise<any> {
            const method = "PUT";
            const url = `${environment.apiUrl}/companies/my/${data.id}`;
            return this.http.request(method, url, { body: data }).toPromise();
        }

}
