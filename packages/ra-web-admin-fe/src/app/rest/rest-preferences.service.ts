import { HttpClient, HttpRequest, HttpHeaders } from "@angular/common/http";
import { Injectable, InjectionToken, Inject } from "@angular/core";
import { EnvironmentInterface, ENVIRONMENT } from "@ra/web-shared-fe";

@Injectable()
export class RestPreferencesService {

    constructor(
        private http: HttpClient,
        @Inject(ENVIRONMENT) private environment: EnvironmentInterface) { }

    public getPreferences(): Promise<any> {
        return this.http.get(`${this.environment.apiUrl}/preferences`)
            .toPromise();
    }

    public savePreferences(
        prefs: any
    ): Promise<any> {
        return this.http.post(`${this.environment.apiUrl}/preferences`,
            { pref: prefs.pref }
        ).toPromise();
    }

    public hitlistSettingsManager(storageKey, method, data?): Promise<any> {
        const url = `${this.environment.apiUrl}/preferences/hitlist/` + storageKey;
        const req = new HttpRequest(method, url, {
            headers: new HttpHeaders({
                Accept: "text/html",
                "Content-Type": "text/html"
            }),
            body: data
        });

        return this.http.request(req).toPromise();
    }

    public getAppPref(name: string): Promise<any> {
        return this.http.get(`${this.environment.apiUrl}/preferences/app/${name}`,
            { headers: new HttpHeaders().set("X-enable-cache", "true") }).toPromise();
    }

    public updatePref(pref: { name: any, value: any }): Promise<any> {
        return this.http.post(`${this.environment.apiUrl}/preferences/update`, pref).toPromise();
    }

    public getUserPref(name: string): Promise<any> {
        return this.http.get(`${this.environment.apiUrl}/preferences/user/${name}`).toPromise();
    }

    public saveUserPref(name: string, data: any): Promise<any> {
        return this.http.post(`${this.environment.apiUrl}/preferences/user/${name}`, data).toPromise();
    }

    public getAllPrefs(): Promise<any[]> {
        return this.http.get<any[]>(`${this.environment.apiUrl}/preferences/all`).toPromise();
    }

    public savePref(pref: any): Promise<any> {
        return this.http.post(`${this.environment.apiUrl}/preferences/save`, pref).toPromise();
    }

    public deletePref(name: any, user: number, company: number): Promise<any> {
        return this.http.delete(`${this.environment.apiUrl}/preferences/delete/${name}/${user}/${company}`).toPromise();
    }

    public reloadMessageFilter(): Promise<any> {
        return this.http.get(`${this.environment.apiUrl}/preferences/reload-filter`).toPromise();
    }

}
