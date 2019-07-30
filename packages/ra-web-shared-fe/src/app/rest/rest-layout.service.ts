import { Injectable, Inject, Optional } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ENVIRONMENT, EnvironmentInterface } from "../shared/environment/environment.interface";

@Injectable({
    providedIn: "root"
})
export class RestLayoutService {

    constructor(
        private http: HttpClient,
        @Inject(ENVIRONMENT) private environment: EnvironmentInterface,
    ) {}

    public getUsersLayoutPreferences(): Promise<any> {
        return this.http.get(`${this.environment.apiUrl}/users/prefs`)
            .toPromise();
    }

    public getLayout(name: string) {
        return this.http.get(`${this.environment.apiUrl}/layout/layout/${name}`).toPromise();
    }

    public setLayout(config: any, name: string) {
        return this.http.post(`${this.environment.apiUrl}/layout/layout/${name}`, config).toPromise();
    }

    public deleteLayout(name: string) {
        return this.http.delete(`${this.environment.apiUrl}/layout/layout/${name}`).toPromise();
    }

    public getLayoutsName(): Promise<string[]> {
        return this.http.get<string[]>(`${this.environment.apiUrl}/layout/layout`).toPromise();
    }

    public getDefaultLayout(modul: string) {
        return this.http.get(`${this.environment.apiUrl}/layout/layout-default/${modul}`).toPromise();
    }

    public setDefaultLayout(modul: string, name: string) {
        return this.http.post(`${this.environment.apiUrl}/layout/layout-default/${modul}`, { name }).toPromise();
    }

}
