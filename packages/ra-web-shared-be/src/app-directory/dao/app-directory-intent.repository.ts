import { Repository, EntityRepository } from "typeorm";
import { RaAppDirectoryIntent } from "../entities/ra-app-directory-intent";

export class AppDirectoryIntentRepository {

    private repo;

    constructor(repo: Repository<RaAppDirectoryIntent>) {
        this.repo = repo;
    }
}
