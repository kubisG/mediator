import { EntityRepository, Repository } from "typeorm";
import { RaAllocation } from "../../entity/ra-allocation";

@EntityRepository(RaAllocation)
export class AllocationsRepository extends Repository<RaAllocation> {

}
