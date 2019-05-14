import { Injectable } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { HttpClient } from "@angular/common/http";
import { AuthApi } from "./auth-api.interface";

@Injectable({
    providedIn: "root"
})
export class AuthService {

    public sendLogin: Subject<any> = new Subject<any>();
    public sendLogin$: Observable<any> = this.sendLogin.asObservable();
    public authApi: AuthApi;

    constructor(private http: HttpClient) {

    }

    public setApi(authApi: AuthApi) {
        this.authApi = authApi;
    }

    public login(email: string, password: string): Promise<any> {
        return this.authApi.login(email, password);
    }

    public logout(): Promise<any> {
        return this.authApi.logout();
    }

}
