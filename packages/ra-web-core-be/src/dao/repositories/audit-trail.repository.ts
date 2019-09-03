import { EntityRepository, Repository } from "typeorm";
import { RaAuditTrail } from "../../db/entity/ra-audit-trail";

@EntityRepository(RaAuditTrail)
export class AuditTrailRepository extends Repository<RaAuditTrail> { }
