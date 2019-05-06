import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) {

    }

    public login(email: string, password: string): Promise<any> {
        return this.http.post(`${environment.apiUrl}/users/auth`, { email, password })
            .toPromise();
    }

    public logout(): Promise<any> {
        return this.http.delete(`${environment.apiUrl}/users/auth`).toPromise();
    }

}
