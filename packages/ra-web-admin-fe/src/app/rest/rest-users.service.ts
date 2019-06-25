import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, Inject } from "@angular/core";
import { EnvironmentInterface, ENVIRONMENT } from "@ra/web-shared-fe";

@Injectable()
export class RestUsersService {

    constructor(
        private http: HttpClient,
        @Inject(ENVIRONMENT) private environment: EnvironmentInterface) {
            console.log(this);
            console.log(this.environment);
        }

    public getUsers(): Promise<any> {
        return this.http.get(`${this.environment.apiUrl}/users/user`)
            .toPromise();
    }

    public getCompanyUsers(): Promise<any> {
        return this.http.get(`${this.environment.apiUrl}/users/company`)
            .toPromise();
    }

    public getUser(id: number): Promise<any> {
        return this.http.get(`${this.environment.apiUrl}/users/user/${id}`,
        { headers: new HttpHeaders().set("X-enable-cache", "true") })
            .toPromise();
    }

    public delUser(id: number): Promise<any> {
        return this.http.delete(`${this.environment.apiUrl}/users/user/${id}`).toPromise();
    }

    public saveUser(user: any
    ): Promise<any> {
        const method = user.id ? "PUT" : "POST";
        const url = user.id ? `${this.environment.apiUrl}/users/user/${user.id}` : `${this.environment.apiUrl}/users/user`;
        return this.http.request(method, url, { body: user }).toPromise();
    }

    public setLogging(userId: number, comapnyId: number, enabled: boolean): Promise<any> {
        return this.http.get(`${this.environment.apiUrl}/users/logging/${userId}/${comapnyId}/${enabled}`).toPromise();
    }

    public saveMail(email: string): Promise<any> {
        return this.http.post(`${this.environment.apiUrl}/users/reset`, { email }).toPromise();
    }

    public getUsersLayoutPreferences(): Promise<any> {
        return this.http.get(`${this.environment.apiUrl}/users/prefs`)
            .toPromise();
    }

    public getLayout(name: string) {
        return this.http.get(`${this.environment.apiUrl}/users/layout/${name}`).toPromise();
    }

    public setLayout(config: any, name: string) {
        return this.http.post(`${this.environment.apiUrl}/users/layout/${name}`, config).toPromise();
    }

    public deleteLayout(name: string) {
        return this.http.delete(`${this.environment.apiUrl}/users/layout/${name}`).toPromise();
    }

    public getLayoutsName(): Promise<string[]> {
        return this.http.get<string[]>(`${this.environment.apiUrl}/users/layout`).toPromise();
    }

}
