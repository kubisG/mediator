import { Injectable } from "@nestjs/common";
import { AppDirectoryItemDto } from "./dto/app-directory-item.dto";
import { AppDirectoryDto } from "./dto/app-directory.dto";

@Injectable()
export class AppDirectoryService {

    public async createApp(token: string, app: AppDirectoryItemDto): Promise<AppDirectoryDto> {
        return;
    }

    public async getAppDef(token: string, appId: number): Promise<AppDirectoryItemDto> {
        return;
    }

    public async searchApps(token: string, app: AppDirectoryItemDto): Promise<AppDirectoryDto> {
        return;
    }

}
