import { EntityRepository, Repository } from "typeorm";
import { RaCompany } from "../../entity/ra-company";

@EntityRepository(RaCompany)
export class CompanyRepository extends Repository<RaCompany> { }
