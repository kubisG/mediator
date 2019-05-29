import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs/internal/Observable";
import { map, catchError } from "rxjs/operators";
@Injectable({
    providedIn: "root",
})
export class RestUsersService {

    constructor(private http: HttpClient) { }

    public login(email: string, password: string): Promise<any> {
        return this.http.post(`${environment.apiUrl}/users/auth`, { email, password })
            .toPromise();
    }

    public logout(): Promise<any> {
        return this.http.delete(`${environment.apiUrl}/users/auth`).toPromise();
    }

    public getLayout() {
        return this.http.get(`${environment.apiUrl}/users/layout`).toPromise();
    }

    public setLayout(config: any) {
        return this.http.post(`${environment.apiUrl}/users/layout`, config).toPromise();
    }

}
