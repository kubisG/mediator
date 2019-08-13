import { EntityRepository, Repository } from "typeorm";
import { RaCompany } from "@ra/web-core-be/src/db/entity/ra-company";

@EntityRepository(RaCompany)
export class CompanyRepository extends Repository<RaCompany> { }
