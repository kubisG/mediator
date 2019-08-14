import { EntityRepository, Repository } from "typeorm";
import { RaCompany } from "@ra/web-core-be/dist/db/entity/ra-company";

@EntityRepository(RaCompany)
export class CompanyRepository extends Repository<RaCompany> { }
