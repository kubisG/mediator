
import { EntityRepository, Repository, AbstractRepository } from "typeorm";
import { RaFormsSpec } from "../entity/ra-forms-specification";

export class FormsSpecRepository{

    private repo;

    constructor(repo: Repository<RaFormsSpec>) {
        this.repo = repo;
    }

}
