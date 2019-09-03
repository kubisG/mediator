import { EntityRepository, Repository } from "typeorm";
import { RaObjectRights } from "../../db/entity/ra-object-rights";

@EntityRepository(RaObjectRights)
export class ObjectRightsRepository extends Repository<RaObjectRights> { }
