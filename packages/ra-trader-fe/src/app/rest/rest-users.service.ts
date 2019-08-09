import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class RestUsersService {

    constructor(private http: HttpClient) { }

    public getUsers(): Promise<any> {
        return this.http.get(`${environment.apiUrl}/users/user`)
            .toPromise();
    }

    public getCompanyUsers(): Promise<any> {
        return this.http.get(`${environment.apiUrl}/users/company`)
            .toPromise();
    }

    public getUser(id: number): Promise<any> {
        return this.http.get(`${environment.apiUrl}/users/user/${id}`,
            { headers: new HttpHeaders().set("X-enable-cache", "true") })
            .toPromise();
    }

    public delUser(id: number): Promise<any> {
        return this.http.delete(`${environment.apiUrl}/users/user/${id}`).toPromise();
    }

    public saveUser(user: any
    ): Promise<any> {
        const method = user.id ? "PUT" : "POST";
        const url = user.id ? `${environment.apiUrl}/users/user/${user.id}` : `${environment.apiUrl}/users/user`;
        return this.http.request(method, url, { body: user }).toPromise();
    }

    public saveMail(email: string): Promise<any> {
        return this.http.post(`${environment.apiUrl}/users/reset`, { email }).toPromise();
    }

    public setLogging(userId: number, comapnyId: number, enabled: boolean): Promise<any> {
        return this.http.get(`${environment.apiUrl}/users/logging/${userId}/${comapnyId}/${enabled}`).toPromise();
    }

    public getUsersLayoutPreferences(): Promise<any> {
        return this.http.get(`${environment.apiUrl}/users/prefs`)
            .toPromise();
    }

    public getDefaultLayout(modul: string) {
        return this.http.get(`${environment.apiUrl}/users/layout-default/${modul}`).toPromise();
    }

    public setDefaultLayout(modul: string, name: string) {
        return this.http.post(`${environment.apiUrl}/users/layout-default/${modul}`, { name }).toPromise();
    }

    public getLayout(name: string) {
        return this.http.get(`${environment.apiUrl}/users/layout/${name}`).toPromise();
    }

    public setLayout(config: any, name: string) {
        return this.http.post(`${environment.apiUrl}/users/layout/${name}`, config).toPromise();
    }

    public deleteLayout(name: string) {
        return this.http.delete(`${environment.apiUrl}/users/layout/${name}`).toPromise();
    }

    public getLayoutsName(): Promise<string[]> {
        return this.http.get<string[]>(`${environment.apiUrl}/users/layout`).toPromise();
    }

}
