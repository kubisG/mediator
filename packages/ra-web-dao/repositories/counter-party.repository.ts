import { EntityRepository } from "typeorm";
import { BaseRepository } from "typeorm-transactional-cls-hooked";
import { RaCounterParty } from "../../core/db/entity/ra-counter-party";

@EntityRepository(RaCounterParty)
export class CounterPartyRepository extends BaseRepository<RaCounterParty> {

}
