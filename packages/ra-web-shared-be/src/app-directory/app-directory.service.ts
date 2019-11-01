import { Injectable, Inject } from "@nestjs/common";
import { AppDirectoryItemDto } from "./dto/app-directory-item.dto";
import { AppDirectoryDto } from "./dto/app-directory.dto";
import { AppDirectoryRepository } from "./dao/app-directory.repository";
import { LightMapper } from "light-mapper";
import { RaAppDirectory } from "./entities/ra-app-directory";
import { AppDirectorySearchDto } from "./dto/app-directory-search.dto";
import { RaAppDirectoryIntent } from "./entities/ra-app-directory-intent";
import { AppDirectoryIntentRepository } from "./dao/app-directory-intent.repository";
import { AppDirectoryIntentDto } from "./dto/app-directory-intent.dto";
import { AppDirectoryTypeRepository } from "./dao/app-directory-type.repository";
import { RaAppDirectoryType } from "./entities/ra-app-directory-type";

@Injectable()
export class AppDirectoryService {

    constructor(
        @Inject("appDirectoryDao") private appDirectoryDao: (AppDirectoryRepository | any),
        @Inject("appDirectoryIntentDao") private appDirectoryIntentDao: (AppDirectoryIntentRepository | any),
        @Inject("appDirectoryTypeDao") private appDirectoryTypeDao: (AppDirectoryTypeRepository | any),
    ) { }

    public async createApp(token: string, app: AppDirectoryItemDto): Promise<AppDirectoryItemDto> {
        const mapper = new LightMapper();
        const appDirectory: RaAppDirectory = mapper.map<RaAppDirectory>(RaAppDirectory, app);
        const intents: RaAppDirectoryIntent[] = [];
        if (app.intents && app.intents.length > 0) {
            for (const intent of app.intents) {
                const mappedIntent: RaAppDirectoryIntent = mapper.map<RaAppDirectoryIntent>(RaAppDirectoryIntent, intent);
                await this.appDirectoryIntentDao.save(mappedIntent);
                intents.push(mappedIntent);
            }
        }
        appDirectory.intents = intents;
        const result: RaAppDirectory = await this.appDirectoryDao.save(appDirectory);
        const mappedItem: AppDirectoryItemDto = mapper.map<AppDirectoryItemDto>(AppDirectoryItemDto, result);
        const mappedIntents: AppDirectoryIntentDto[] = [];
        for (const intent of mappedItem.intents) {
            mappedIntents.push(
                mapper.map<AppDirectoryIntentDto>(AppDirectoryIntentDto, intent),
            );
        }
        mappedItem.intents = mappedIntents;
        return mappedItem;
    }

    public async createManifest(token: string, manifest: any, appId: string, type: string) {
        const app: RaAppDirectory = await this.appDirectoryDao.findOne({ appId });
        const result: RaAppDirectoryType = await this.appDirectoryTypeDao.addNewType(manifest, app, type);
        return result[type];
    }

    public async getAppDef(token: string, appId: string): Promise<AppDirectoryItemDto> {
        const app: RaAppDirectory = await this.appDirectoryDao.getApp(appId);
        const mapper = new LightMapper();
        return mapper.map<AppDirectoryItemDto>(AppDirectoryItemDto, app);
    }

    public async searchApps(token: string, query: any): Promise<AppDirectoryDto> {
        query = { ...query };
        const mapper = new LightMapper();
        const searchQuery: AppDirectorySearchDto = mapper.map<AppDirectorySearchDto>(AppDirectorySearchDto, query);
        const results: RaAppDirectory[] = await this.appDirectoryDao.searchApps(searchQuery);
        const mappedApps = [];
        for (const app of results) {
            const mappedApp: AppDirectoryItemDto = mapper.map<AppDirectoryItemDto>(AppDirectoryItemDto, app);
            mappedApps.push(mappedApp);
        }
        const appDirectory: AppDirectoryDto = new AppDirectoryDto();
        appDirectory.applications = mappedApps;
        return appDirectory;
    }

    public async getManifest(token: string, appId: string): Promise<any> {
        const app: RaAppDirectory = await this.appDirectoryDao.getApp(appId);
        const manifestType = app.manifestType;
        return app.manifestDef[manifestType];
    }

}
