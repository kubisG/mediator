// import { AppDirectoryItemDto } from "@ra/web-shared/app-directory-item.dto";
// import { AppDirectorySearchDto } from "@ra/web-shared/app-directory-search.dto";
// import { AppDirectoryDto } from "@ra/web-shared/app-directory.dto";

export interface AppDirectory {

    createApp(app: any): Promise<any>;

    createManifest(manifest: any, appId: string, type: string): Promise<any>;

    getAppDef(appId: string): Promise<any>;

    searchApps(query: any): Promise<any>;

    getManifets(appId: string): Promise<any>;

}
