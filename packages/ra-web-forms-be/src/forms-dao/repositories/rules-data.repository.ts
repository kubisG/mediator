
import { EntityRepository, Repository, AbstractRepository } from "typeorm";
import { RaRulesData } from "../entity/ra-rules-data";

export class RulesDataRepository{

    private repo;

    constructor(repo: Repository<RaRulesData>) {
        this.repo = repo;
    }

}
