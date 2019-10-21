
import { EntityRepository, Repository, AbstractRepository, QueryRunner } from "typeorm";
import { RaLocatesUpdate } from "../entity/ra-locates-update";
import { Subject, Observable } from "rxjs";

export class LocatesUpdateRepository {

    private repo;

    constructor(repo: Repository<RaLocatesUpdate>) {
        this.repo = repo;

    }
}
