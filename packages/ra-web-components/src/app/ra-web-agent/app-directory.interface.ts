import { AppDirectoryItemDto } from "@ra/web-shared/app-directory-item.dto";
import { AppDirectorySearchDto } from "@ra/web-shared/app-directory-search.dto";
import { AppDirectoryDto } from "@ra/web-shared/app-directory.dto";

export interface AppDirectory {

    createApp(app: AppDirectoryItemDto): Promise<AppDirectoryItemDto>;

    createManifest(manifest: any, appId: string, type: string): Promise<any>;

    getAppDef(appId: string): Promise<AppDirectoryItemDto>;

    searchApps(query: AppDirectorySearchDto): Promise<AppDirectoryDto>;

    getManifets(appId: string): Promise<any>;

}
