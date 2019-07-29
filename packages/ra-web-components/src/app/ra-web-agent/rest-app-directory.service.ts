import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AppDirectory } from "./app-directory.interface";
import { AppDirectoryItemDto } from "@ra/web-shared/app-directory-item.dto";
import { AppDirectoryDto } from "@ra/web-shared/app-directory.dto";
import { AppDirectorySearchDto } from "@ra/web-shared/app-directory-search.dto";

@Injectable()
export class RestAppDirectoryService implements AppDirectory {

    private host: string;

    constructor(private http: HttpClient) { }

    public setHost(host: string) {
        this.host = host;
    }

    createApp(app: AppDirectoryItemDto): Promise<AppDirectoryItemDto> {
        return this.http.post<AppDirectoryItemDto>(`${this.host}/apps`, app).toPromise();
    }

    createManifest(manifest: any, appId: string, type: string): Promise<any> {
        return this.http.post(`${this.host}/apps/${appId}/${type}`, manifest).toPromise();
    }

    getAppDef(appId: string): Promise<AppDirectoryItemDto> {
        return this.http.get<AppDirectoryItemDto>(`${this.host}/apps/${appId}`).toPromise();
    }

    searchApps(query: AppDirectorySearchDto): Promise<AppDirectoryDto> {
        const params = new HttpParams({
            fromObject: (query as any)
        });
        return this.http.get<AppDirectoryDto>(`${this.host}/apps/search`, { params }).toPromise();
    }

    getManifets(appId: string): Promise<any> {
        return this.http.get(`${this.host}/apps/manifest/${appId}`).toPromise();
    }

    callGet(url: string) {
        return this.http.get(`${url}`).toPromise();
    }

}
