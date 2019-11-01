import { Repository, EntityRepository } from "typeorm";
import { RaAppDirectoryType } from "../entities/ra-app-directory-type";
import { RaAppDirectory } from "../entities/ra-app-directory";

export class AppDirectoryTypeRepository {

    private repo;

    constructor(repo: Repository<RaAppDirectoryType>) {
        this.repo = repo;
    }

    public async addNewType(manifest: any, app: RaAppDirectory, type: string): Promise<RaAppDirectoryType> {
        const dirType = new RaAppDirectoryType();
        dirType[type] = manifest;
        dirType.app = app;
        return await this.repo.save(dirType);
    }

}
