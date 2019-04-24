import { EntityRepository } from "typeorm";
import { RaAllocation } from "../../core/db/entity/ra-allocation";
import { BaseRepository } from "typeorm-transactional-cls-hooked";

@EntityRepository(RaAllocation)
export class AllocationsRepository extends BaseRepository<RaAllocation> {

}
