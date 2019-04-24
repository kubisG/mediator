import { EntityRepository } from "typeorm";
import { RaCompany } from "../../core/db/entity/ra-company";
import { BaseRepository } from "typeorm-transactional-cls-hooked";

@EntityRepository(RaCompany)
export class CompanyRepository extends BaseRepository<RaCompany> { }
