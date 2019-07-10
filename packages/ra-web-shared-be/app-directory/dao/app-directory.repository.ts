import { Repository, EntityRepository } from "typeorm";
import { RaAppDirectory } from "../entities/ra-app-directory";
import { AppDirectorySearchDto } from "../dto/app-directory-search.dto";

@EntityRepository(RaAppDirectory)
export class AppDirectoryRepository extends Repository<RaAppDirectory> {

    public async getApp(appId: string): Promise<RaAppDirectory> {
        return await this.findOne({ where: { appId }, relations: ["intents", "manifestDef"] });
    }

    public async searchApps(searchQuery: AppDirectorySearchDto): Promise<RaAppDirectory[]> {
        return await this.find({ where: searchQuery, relations: ["intents", "manifestDef"] });
    }

}
