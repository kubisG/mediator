import { EntityRepository, Repository } from "typeorm";
import { RaInputRelations } from "../../entity/ra-input-relations";

@EntityRepository(RaInputRelations)
export class InputRelationsRepository extends Repository<RaInputRelations> {

}
